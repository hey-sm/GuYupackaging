import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext, IAuthContext } from './AuthContext';

export type UseGetIdentityProps<TData> = {
  queryOptions?: UseQueryOptions<TData>;
};

export const useGetIdentity = <TData = any>({
  queryOptions,
}: UseGetIdentityProps<TData> = {}): UseQueryResult<TData, unknown> => {
  const { getUserIdentity } = useContext<IAuthContext>(AuthContext);

  const queryResponse = useQuery<TData>(
    ['getUserIdentity'],
    // Enabled check for `getUserIdentity` is enough to be sure that it's defined in the query function but TS is not smart enough to know that.
    getUserIdentity ?? (() => Promise.resolve({})),
    {
      enabled: !!getUserIdentity,
      retry: false,
      ...queryOptions,
    }
  );

  return queryResponse;
};
