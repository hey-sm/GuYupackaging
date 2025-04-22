import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext, IAuthContext } from './AuthContext';

export type UseGetMenus<RecordType = any> = {
  queryOptions?: UseQueryOptions<RecordType[], unknown>;
};

export const useGetMenus = <RecordType = any>({
  queryOptions,
}: UseGetMenus = {}): UseQueryResult<RecordType[], unknown> => {
  const { getMenus } = useContext<IAuthContext>(AuthContext);

  const queryResponse = useQuery<RecordType[], unknown, RecordType[]>(
    ['getMenus'],
    getMenus ?? (() => Promise.resolve([])),
    {
      enabled: !!getMenus,
      retry: false,
      ...queryOptions,
    }
  );

  return queryResponse;
};
