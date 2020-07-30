import { Component } from "react";
import { interfaces } from "inversify";
import { ProviderContext, ProviderContextType } from "../contexts/ProviderContext";

export function componentInject(
  target: any,
  propertyKey: string,
  identifier?: interfaces.ServiceIdentifier<any>
): PropertyDescriptor {
  const type: interfaces.ServiceIdentifier<any> = Reflect.getMetadata(
    "design:type",
    target,
    propertyKey
  );
  if (!identifier) identifier = type;
  const isArrayType: boolean = identifier === Array;

  target.constructor.contextType = ProviderContext;
  return setDependentProperty(target, propertyKey, identifier, isArrayType);
}

function setDependentProperty(
  _: any,
  propertyKey: string,
  identifier: interfaces.ServiceIdentifier<any>,
  isArrayType: boolean
): PropertyDescriptor {
  const GET_KEY: string = isArrayType ? "getAll" : "get";

  return {
    configurable: true,
    enumerable: true,
    get(): any {
      checkIfContainerExists((this as Component).context, this.constructor.name);
      const value: any = (this as Component).context.container[GET_KEY](identifier);
      Object.defineProperty(this, propertyKey, { value });

      return value;
    },
    set(value: any): void {
      Object.defineProperty(this, propertyKey, { value });
    },
  };
}

export function checkIfContainerExists(context: ProviderContextType, name: string): void {
  if (!context || !context.container) {
    throw new Error(
      `Component "${name}" need to be nested in a Module or Provider Component` +
        ` to use dependency injection.`
    );
  }
}
