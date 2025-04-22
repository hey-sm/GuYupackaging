import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useContext } from 'react';
import { IAuthContext, AuthContext } from './AuthContext';

export const usePermissions = <TData = any>(
  options?: UseQueryOptions<TData>
): UseQueryResult<TData, unknown> => {
  const { getPermissions } = useContext<IAuthContext>(AuthContext);

  const queryResponse = useQuery<TData>(
    ['usePermissions'],
    // Enabled check for `getPermissions` is enough to be sure that it's defined in the query function but TS is not smart enough to know that.
    getPermissions ?? (() => Promise.resolve(undefined)),
    {
      enabled: !!getPermissions,
      ...options,
    }
  );

  return queryResponse;
};
