import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useHydrateAtoms } from 'jotai/utils';
import { FC, ReactNode, useMemo } from 'react';
import { RouteObject } from 'react-router-dom';
import { resourcesAtom } from '../atoms';
import { AuthContextProvider, AuthProvider } from '../auth';
import { Resource } from '../types';

export interface RouterProvider {
  routes?: RouteObject[];
}

export interface AdminContextValue {
  authProvider?: AuthProvider;
  routerProvider?: RouterProvider;
  children?: ReactNode;
  resources: Resource[];
  reactQueryClientConfig?: QueryClientConfig;
}

export const Admin: FC<AdminContextValue> = (props) => {
  const { authProvider, children, resources } = props;

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
    []
  );

  useHydrateAtoms([[resourcesAtom, resources]]);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider {...(authProvider ?? {})}>
        {children}
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default Admin;
