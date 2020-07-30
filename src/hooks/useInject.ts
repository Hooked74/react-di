import { interfaces } from "inversify";
import { useContext } from "react";
import { ProviderContext, ProviderContextType } from "contexts/ProviderContext";

export const useInject: (...identifiers: interfaces.ServiceIdentifier<any>[]) => any = (
  ...identifiers: interfaces.ServiceIdentifier<any>[]
) => {
  const { container }: ProviderContextType = useContext(ProviderContext);

  if (!container) {
    throw new Error(
      `Functional component need to be nested in a Module or Provider Component to use dependency injection.`
    );
  }

  return identifiers.map((identifier: interfaces.ServiceIdentifier<any>) =>
    container.get(identifier)
  );
};
