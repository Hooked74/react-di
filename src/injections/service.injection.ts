import { inject, interfaces, multiInject } from "inversify";

export function serviceInject(
  target: object,
  propertyKey: string | symbol,
  parameterIndex: number,
  identifier?: interfaces.ServiceIdentifier<any>
): void {
  const type: interfaces.ServiceIdentifier<any> = Reflect.getMetadata("design:paramtypes", target)[
    parameterIndex
  ];
  const isArrayType: boolean = type === Array;
  const injectHandler: Handler = isArrayType ? multiInject : inject;
  if (!identifier) identifier = type;

  injectHandler(identifier)(target, propertyKey as string, parameterIndex);
}
