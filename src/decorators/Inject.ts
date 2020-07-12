import { interfaces } from "inversify";
import { componentInject } from "../injections/component.injection";
import { serviceInject } from "../injections/service.injection";

export function Inject(
  target: object,
  propertyKey: string | symbol,
  parameterIndex?: number
): PropertyDescriptor | void;
export function Inject(identifier: any): ParameterDecorator;
export function Inject(...args: any[]): PropertyDescriptor | ParameterDecorator | void {
  if (args.length > 1) {
    const [target, propertyKey, parameterIndex]: any = args;
    return decorate(target, propertyKey, parameterIndex);
  } else {
    const identifier: interfaces.ServiceIdentifier<any> = args[0];
    return (target: object, propertyKey: string | symbol, parameterIndex?: number) =>
      decorate(target, propertyKey, parameterIndex, identifier);
  }
}

function decorate(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number | undefined,
  identifier?: interfaces.ServiceIdentifier<any>
): PropertyDescriptor | void {
  return typeof parameterIndex === "number"
    ? serviceInject(target, propertyKey, parameterIndex, identifier)
    : componentInject(target, propertyKey as string, identifier);
}
