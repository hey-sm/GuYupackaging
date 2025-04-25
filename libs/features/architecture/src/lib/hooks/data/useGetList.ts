import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { GetListParams, GetListResult, RaRecord } from '../../types';

import { useDataProvider } from './useDataProvider';

export type UseGetListHookValue<RecordType extends RaRecord = any> =
  UseQueryResult<RecordType[], Error> & {
    total?: number;
    pageInfo?: {
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
  };

export const useGetList = <RecordType extends RaRecord = any>(
  resource: string,
  params: Partial<GetListParams> = {},
  options?: UseQueryOptions<GetListResult<RecordType>, Error>
): UseGetListHookValue<RecordType> => {
  const {
    pagination = { page: 1, perPage: 25 },
    sort = { field: 'id', order: 'DESC' },
    filter = {},
    meta,
  } = params;

  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();

  const result = useQuery<
    GetListResult<RecordType>,
    Error,
    GetListResult<RecordType>
  >(
    [resource, 'getList', { pagination, sort, filter, meta }],
    () =>
      dataProvider
        .getList<RecordType>(resource, {
          pagination,
          sort,
          filter,
          meta,
        })
        ?.then(({ data, total, pageInfo }) => ({
          data,
          total,
          pageInfo,
        })),
    {
      onSuccess: ({ data }) => {
        // optimistically populate the getOne cache
        data.forEach((record) => {
          queryClient.setQueryData(
            [resource, 'getOne', { id: String(record.id), meta }],
            (oldRecord) => oldRecord ?? record
          );
        });
      },
      ...options,
    }
  );

  return (
    result.data
      ? {
          ...result,
          data: result.data?.data,
          total: result.data?.total,
          pageInfo: result.data?.pageInfo,
        }
      : result
  ) as UseQueryResult<RecordType[], Error> & {
    total?: number;
    pageInfo?: {
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
  };
};
