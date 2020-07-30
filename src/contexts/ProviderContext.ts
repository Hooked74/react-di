import React from "react";
import { Container } from "inversify";

export interface ProviderContextType {
  container: Container;
}

export const ProviderContext: React.Context<ProviderContextType> = React.createContext(null);
