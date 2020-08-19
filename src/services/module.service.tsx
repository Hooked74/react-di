import React, { Component } from "react";
import { Provider } from "../components/Provider";
import { Container } from "inversify";
import { ModuleContext, ModuleContextType } from "../contexts/ModuleContext";

export function createModuleComponent({
  getContainer,
  getChild,
}: H74_RD.ModuleCreationOptions): any {
  class ModuleProvider extends Component {
    public static contextType: typeof ModuleContext = ModuleContext;

    private container: Container;

    constructor(props: any, context: ModuleContextType) {
      super(props, context);
      if (!this.context) this.context = {};
      this.context.childContainers = this.context.childContainers || new WeakMap();
      this.container = getContainer(this);
    }

    public render(): JSX.Element {
      return (
        <ModuleContext.Provider value={{ childContainers: this.context?.childContainers }}>
          <Provider container={this.container}>{getChild(this)}</Provider>
        </ModuleContext.Provider>
      );
    }
  }

  return React.forwardRef((props: any, ref: any) => {
    return <ModuleProvider {...props} forwardedRef={ref} />;
  });
}
