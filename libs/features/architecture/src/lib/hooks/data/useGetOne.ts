import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { GetOneParams, RaRecord } from '../../types';
import { useDataProvider } from './useDataProvider';

export type UseGetOneHookValue<RecordType extends RaRecord = any> =
  UseQueryResult<RecordType>;

export const useGetOne = <RecordType extends RaRecord = any>(
  resource: string,
  { id, meta }: GetOneParams,
  options?: UseQueryOptions<RecordType>
): UseGetOneHookValue<RecordType> => {
  const dataProvider = useDataProvider();

  return useQuery<RecordType, unknown, RecordType>(
    [resource, 'getOne', { id: String(id), meta }],
    () =>
      dataProvider
        .getOne<RecordType>(resource, { id, meta })
        .then(({ data }) => data),
    options
  );
};
