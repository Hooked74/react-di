declare namespace ReactDiCommon {
  interface ProviderContext {
    childContainers: WeakMap<any, import("inversify").Container>;
  }

  type Container = import("inversify").Container;
  type Newable<T> = import("inversify").interfaces.Newable<T>;

  interface BaseBinding {
    provide: import("inversify").interfaces.ServiceIdentifier<any>;
  }

  interface ClassBinding extends BaseBinding {
    useClass: Newable<any>;
    noSingleton?: boolean;
  }

  interface FactoryBinding extends BaseBinding {
    useFactory: (context: import("inversify").interfaces.Context) => any;
  }

  interface ValueBinding extends BaseBinding {
    useValue: any;
  }

  type Binding = ClassBinding | ValueBinding | FactoryBinding | Newable<any>;

  type BindingHandler = (container: Container, binding: Binding) => void;

  interface BindingHandlers {
    useClass: BindingHandler;
    useValue: BindingHandler;
    useFactory: BindingHandler;
  }

  type Imports = any[];

  interface ModuleOptions {
    imports?: Imports;
    providers?: Binding[];
    autoBindInjectable?: boolean;
  }

  interface ModuleCreationOptions {
    getContainer(this: React.Component): Container;
    getChild(this: React.Component): React.ReactNode;
  }

  interface ContainerOptions {
    providers?: Binding[];
    autoBindInjectable?: boolean;
  }
}

import H74_RD = ReactDiCommon;

declare module "inversify/lib/planning/planner" {
  export const getBindingDictionary: Handler;
}
