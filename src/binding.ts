import { Container, interfaces } from "inversify";

const bindings: H74_RD.BindingHandlers = {
  useClass: (container: Container, { provide, useClass, noSingleton }: H74_RD.ClassBinding) => {
    const binding: interfaces.BindingInWhenOnSyntax<any> = container.bind(provide).to(useClass);
    if (noSingleton) binding.inTransientScope();
  },
  useValue: (container: Container, { provide, useValue }: H74_RD.ValueBinding) => {
    container.bind(provide).toConstantValue(useValue);
  },
  useFactory: (container: Container, { provide, useFactory }: H74_RD.FactoryBinding) => {
    container.bind(provide).toDynamicValue(useFactory);
  },
} as H74_RD.BindingHandlers;

export function executeBindings(container: Container, providers: H74_RD.Binding[] = []): void {
  for (const provider of providers) {
    if (typeof provider === "function") {
      bindings.useClass(container, { useClass: provider, provide: provider });
    } else {
      for (const key of Object.keys(bindings)) {
        if (provider[key as keyof H74_RD.Binding]) {
          bindings[key as keyof typeof bindings](container, provider);
        }
      }
    }
  }
}
