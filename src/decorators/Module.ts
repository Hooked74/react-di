import React, { Component, ReactNode, ComponentClass } from "react";
import { Container } from "inversify";
import { createModuleComponent } from "../services/module.service";
import { Module as ModuleClass } from "../module";

export function Module(options: H74_RD.ModuleOptions = {}): ClassDecorator {
  return (target: any) => {
    const moduleComponent: ComponentClass = createModuleComponent({
      getContainer(this: Component): Container {
        return ModuleClass.getModule(this.constructor).getInternalContainer(this.context);
      },
      getChild(this: Component): ReactNode {
        return React.createElement(target, this.props);
      },
    });

    ModuleClass.setModule(moduleComponent, new ModuleClass(moduleComponent, options));

    return moduleComponent as any;
  };
}
