import { Container } from "inversify";
import { createContainerWithBindings, merge } from "./services/container.service";

const MODULE_META_DATA: string = "react-di";

export class Module {
  public static getModule(target: any): Module {
    return Reflect.getMetadata(MODULE_META_DATA, target);
  }

  public static setModule(target: any, moduleMeta: Module): void {
    Reflect.defineMetadata(MODULE_META_DATA, moduleMeta, target);
  }

  constructor(private target: any, private options: H74_RD.ModuleOptions) {}

  public getExternalContainer(context: H74_RD.ProviderContext): Container {
    let container: Container = (context as H74_RD.ProviderContext).childContainers.get(this.target);

    if (!container) {
      container = createContainerWithBindings(this.options);
      context.childContainers.set(this.target, container);
    }

    return container;
  }

  public getInternalContainer(context: H74_RD.ProviderContext): Container {
    let container: Container = this.getExternalContainer(context);

    if (this.options.imports) {
      container = this.getContainerWithImports(this.options.imports, container, context);
    }

    return container;
  }

  private getContainerWithImports(
    imports: H74_RD.Imports,
    container: Container,
    context: H74_RD.ProviderContext
  ): Container {
    return imports.reduce((container: Container, toImportTarget: any) => {
      const module: Module = Module.getModule(toImportTarget);
      const toImportContainer: Container = module.getExternalContainer(context);

      return merge(container, toImportContainer);
    }, container);
  }
}
