import React, { Component, ComponentClass, ReactNode } from "react";
import { Container } from "inversify";
import { ProviderContext, ProviderContextType } from "../contexts/ProviderContext";

export interface ProviderProps {
  container: Container;
  imports?: ComponentClass[];
}

export class Provider extends Component<ProviderProps> {
  public static contextType: typeof ProviderContext = ProviderContext;

  constructor(props: ProviderProps, context: ProviderContextType) {
    super(props, context);
    this.trySetParentContainer(this.props.container);
  }

  private trySetParentContainer(container: Container): void {
    if (this.context?.container && !container.parent) {
      container.parent = this.context.container;
    }
  }

  public render(): ReactNode {
    return (
      <ProviderContext.Provider value={{ container: this.props.container }}>
        {this.props.children}
      </ProviderContext.Provider>
    );
  }
}
