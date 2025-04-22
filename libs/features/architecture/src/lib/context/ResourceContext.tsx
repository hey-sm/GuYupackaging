import { createContext, ReactNode, useContext } from 'react';

export const ResourceContext = createContext<string>('');

export const ResourceContextProvider = ({
  value,
  children,
}: {
  value?: string;
  children: ReactNode;
}) => {
  return (
    <ResourceContext.Provider value={value as string}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResourceContext = <
  ResourceType extends Partial<{ resource: string }>
>(
  props?: ResourceType
) => {
  const context = useContext(ResourceContext);
  return (props && props.resource) || context;
};
