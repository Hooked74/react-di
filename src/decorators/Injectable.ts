import { injectable } from "inversify";

export function Injectable(target: object): any {
  return injectable()(target);
}
