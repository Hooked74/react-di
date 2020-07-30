import React from "react";
import { Container } from "inversify";

export interface ModuleContextType {
  childContainers: WeakMap<any, Container>;
}

export const ModuleContext: React.Context<ModuleContextType> = React.createContext(null);
