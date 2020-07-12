import PropTypes from "prop-types";
import { Component, ComponentClass } from "react";
import { interfaces } from "inversify";

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
  const isArrayType: boolean = type === Array;
  identifier = identifier || type;

  ensureContainerContextExists(target.constructor);
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
      checkIfContainerExists(this as any);
      const value: any = (this as any).context.container[GET_KEY](identifier);
      Object.defineProperty(this, propertyKey, { value });

      return value;
    },
    set(value: any): void {
      Object.defineProperty(this, propertyKey, { value });
    },
  };
}

function checkIfContainerExists(component: Component): void {
  if (!component.context || !component.context.container) {
    throw new Error(
      `Component "${component.constructor.name}" need to be nested in a Module or Provider Component` +
        ` to use dependency injection.`
    );
  }
}

function ensureContainerContextExists(componentClass: ComponentClass): void {
  if (!componentClass.contextTypes) {
    componentClass.contextTypes = {};
  }
  if (!componentClass.contextTypes.container) {
    componentClass.contextTypes.container = PropTypes.object;
  }
}
