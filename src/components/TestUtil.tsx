import { Component, ReactNode, ComponentType } from "react";
import { Container } from "inversify";
import { createModuleComponent } from "../services/module.service";
import { createContainerWithBindings } from "../services/container.service";

export type TestUtilProps = H74_RD.ContainerOptions;

export const TestUtil: ComponentType = createModuleComponent({
  getContainer(module: Component<H74_RD.ContainerOptions>): Container {
    return createContainerWithBindings(module.props);
  },
  getChild(module: Component): ReactNode {
    return module.props.children;
  },
});
