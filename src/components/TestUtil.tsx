import { Component, ComponentClass, ReactNode } from "react";
import { Container } from "inversify";
import { createModuleComponent } from "../services/module.service";
import { createContainerWithBindings } from "../services/container.service";

export type TestUtilProps = H74_RD.ContainerOptions;

export const TestUtil: ComponentClass = createModuleComponent({
  getContainer(this: Component<H74_RD.ContainerOptions>): Container {
    return createContainerWithBindings(this.props);
  },
  getChild(this: Component): ReactNode {
    return this.props.children;
  },
});
