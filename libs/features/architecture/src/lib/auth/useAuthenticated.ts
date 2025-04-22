import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useContext } from 'react';
import { IAuthContext, AuthContext } from './AuthContext';

export const useAuthenticated = (
  params?: any
): UseQueryResult<any, unknown> => {
  const { checkAuth } = useContext<IAuthContext>(AuthContext);

  const queryResponse = useQuery(
    ['useAuthenticated', params],
    async () => (await checkAuth?.(params)) ?? {},
    {
      retry: false,
    }
  );

  return queryResponse;
};
