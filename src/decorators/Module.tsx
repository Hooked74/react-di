import React, { Component, ReactNode, ComponentType } from "react";
import { Container } from "inversify";
import { createModuleComponent } from "../services/module.service";
import { Module as ModuleClass } from "../module";

export function Module(options: H74_RD.ModuleOptions = {}): ClassDecorator {
  return (Target: any) => {
    const ModuleComponent: ComponentType = createModuleComponent({
      getContainer(module: Component): Container {
        return ModuleClass.getModule(ModuleComponent).getInternalContainer(module.context);
      },
      getChild(module: Component): ReactNode {
        const { forwardedRef, ...props }: any = module.props;
        return <Target {...props} ref={forwardedRef} />;
      },
    });

    ModuleClass.setModule(ModuleComponent, new ModuleClass(ModuleComponent, options));

    return ModuleComponent as any;
  };
}
