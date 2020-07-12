import React, { Component, ComponentClass } from "react";
import { Provider } from "../components/Provider";
import PropTypes from "prop-types";
import { Container } from "inversify";

export function createModuleComponent({
  getContainer,
  getChild,
}: H74_RD.ModuleCreationOptions): ComponentClass {
  const contextTypes: any = { childContainers: PropTypes.object };
  return class extends Component {
    public static childContextTypes: any = contextTypes;
    public static contextTypes: any = contextTypes;

    private container: Container;

    constructor(props: any, context: any) {
      super(props, context);
      this.context.childContainers = this.context.childContainers || new WeakMap();
      this.container = getContainer.call(this);
    }

    public getChildContext(): any {
      return {
        childContainers: this.context.childContainers,
      };
    }

    public render(): JSX.Element {
      return React.createElement(Provider, { container: this.container }, getChild.call(this));
    }
  } as ComponentClass;
}
