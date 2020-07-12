import React, { Component, ComponentClass, ReactElement, ReactNode } from "react";
import { Container } from "inversify";
import PropTypes from "prop-types";

export interface ProviderProps {
  container: Container;
  imports?: ComponentClass[];
}

export interface ProviderContext {
  container: Container;
}

export class Provider extends Component<ProviderProps> {
  public static childContextTypes: any = {
    container: PropTypes.object.isRequired,
  };
  public static contextTypes: any = { container: PropTypes.object };
  public static isReact16Plus: boolean = parseFloat(React.version) >= 16;

  constructor(props: ProviderProps, context: ProviderContext) {
    super(props, context);

    if (!Provider.isReact16Plus) {
      this.render = () => React.Children.only(this.props.children) as any;
    }
  }

  public getChildContext(): ProviderContext {
    const { container }: ProviderProps = this.props;
    this.trySetParentContainer(container);
    return { container };
  }

  private trySetParentContainer(container: Container): void {
    if (this.context.container && !container.parent) {
      container.parent = this.context.container;
    }
  }

  public render(): ReactNode {
    return React.Children.toArray(this.props.children).map((child: ReactNode, index: int) =>
      React.cloneElement(child as ReactElement<any>, { key: index })
    );
  }
}
