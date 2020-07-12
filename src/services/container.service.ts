import { executeBindings } from "../binding";
import { Container, interfaces } from "inversify";
import { getBindingDictionary } from "inversify/lib/planning/planner";

export function createContainerWithBindings({
  autoBindInjectable,
  providers,
}: H74_RD.ContainerOptions): Container {
  const DEFAULT_AUTO_BIND: boolean = false;
  const container: Container = new Container({
    defaultScope: "Singleton",
    autoBindInjectable: autoBindInjectable !== void 0 ? autoBindInjectable : DEFAULT_AUTO_BIND,
  });
  executeBindings(container, providers);

  return container;
}

export function merge(container1: Container, container2: Container): Container {
  const container: Container = new Container();
  const bindingDictionary: interfaces.Lookup<interfaces.Binding<any>> = getBindingDictionary(
    container
  );

  function copyDictionary(
    origin: interfaces.Lookup<interfaces.Binding<any>>,
    destination: interfaces.Lookup<interfaces.Binding<any>>
  ): void {
    origin.traverse((_: interfaces.ServiceIdentifier<any>, value: any[]) => {
      value.forEach((binding: interfaces.Binding<any>) => {
        destination.add(binding.serviceIdentifier, binding);
      });
    });
  }

  copyDictionary(getBindingDictionary(container1), bindingDictionary);
  copyDictionary(getBindingDictionary(container2), bindingDictionary);

  return container;
}
