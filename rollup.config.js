require("dotenv").config();

import { dirname, basename } from "path";
import babel from "rollup-plugin-babel";
import tslint from "rollup-plugin-tslint";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";
import json from "@rollup/plugin-json";
import { uglify } from "rollup-plugin-uglify";
import strip from "@rollup/plugin-strip";
import replace from "@rollup/plugin-replace";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import license from "rollup-plugin-license";
import visualizer from "rollup-plugin-visualizer";

import pkg from "./package.json";

const input = "./src/index.ts";
const extensions = [".js", ".jsx", ".ts", ".tsx"];
const banner = {
  banner: `Copyright ${new Date().toDateString()}\nv${pkg.version} by ${pkg.author}`,
};

// Treat as externals all not relative and not absolute paths
// e.g. 'react'
const excludeAllExternals = (id) => !id.startsWith(".") && !id.startsWith("/");

const getBabelOptions = ({ useESModules }) => ({
  exclude: "node_modules/**",
  runtimeHelpers: true,
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3,
        useESModules,
        absoluteRuntime: dirname(require.resolve("@babel/runtime/package.json")),
      },
    ],
  ],
  extensions,
});

const commonjsArgs = {
  include: "node_modules/**",
  namedExports: {
    "node_modules/react/index.js": [
      "createContext",
      "forwardRef",
      "createElement",
      "Component",
      "Fragment",
      "PureComponent",
    ],
    "node_modules/react-dom/index.js": ["render", "hydrate"],
  },
};

const config = [
  // Universal module definition (UMD) build
  // - including console.* statements
  {
    input,
    output: {
      file: "dist/react-di.js",
      format: "umd",
      name: "ReactDi",
      globals: { react: "React", "react-dom": "ReactDOM" },
      sourcemap: true,
      exports: "named",
    },
    plugins: [
      tslint({ throwOnError: true }),
      resolve({ extensions }),
      url({ exclude: ["**/*.svg"] }),
      json(),
      svgr(),
      replace({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
      commonjs(commonjsArgs),
      babel(getBabelOptions({ useESModules: true })),
    ],
  },

  // CommonJS (cjs) build
  // - Keeping console.log statements
  // - All external packages are not bundled
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
    external: excludeAllExternals,
    plugins: [
      tslint({ throwOnError: true }),
      resolve({ extensions }),
      url({ exclude: ["**/*.svg"] }),
      json(),
      svgr(),
      replace({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
      commonjs(commonjsArgs),
      babel(getBabelOptions({ useESModules: false })),
    ],
  },

  // EcmaScript Module (esm) build
  // - Keeping console.log statements
  // - All external packages are not bundled
  {
    input,
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
    external: excludeAllExternals,
    plugins: [
      tslint({ throwOnError: true }),
      resolve({ extensions }),
      url({ exclude: ["**/*.svg"] }),
      json(),
      svgr(),
      replace({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
      commonjs(commonjsArgs),
      babel(getBabelOptions({ useESModules: false })),
    ],
  },
];

if (process.env.ANALYZE === "true") {
  config.forEach((c, i) =>
    c.plugins.push(
      visualizer({
        open: true,
        title: basename(c.output.file),
        filename: `node_modules/.cache/analyze/bundle_${basename(c.output.file)}.html`,
      })
    )
  );
} else {
  config.unshift(
    // Minified UMD build
    {
      input,
      output: {
        file: "dist/react-di.min.js",
        format: "umd",
        name: "ReactDi",
        globals: { react: "React", "react-dom": "ReactDOM" },
        exports: "named",
      },
      plugins: [
        tslint({ throwOnError: true }),
        resolve({ extensions }),
        url({ exclude: ["**/*.svg"] }),
        json(),
        svgr(),
        replace({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
        commonjs(commonjsArgs),
        strip({ debugger: true }),
        babel(getBabelOptions({ useESModules: true })),
        uglify(),
      ],
    }
  );
  config.forEach((c) => c.plugins.push(license(banner), sizeSnapshot()));
}

export default config;
