import { QueryKey } from '@tanstack/react-query';
import { UseListConfig } from '../hooks/data/useList';
import { BaseKey, MetaDataQuery } from '../types';

export interface IQueryKeys {
  all: QueryKey;
  resourceAll: QueryKey;
  list: (config?: UseListConfig | undefined) => QueryKey;
  many: (ids?: BaseKey[]) => QueryKey;
  detail: (id: BaseKey) => QueryKey;
  logList: (meta?: Record<number | string, any>) => QueryKey;
}

export const queryKeys = (
  resource?: string,
  metaData?: MetaDataQuery | undefined
): IQueryKeys => {
  const providerName = 'default';
  const keys: IQueryKeys = {
    all: [providerName],
    resourceAll: [providerName, resource || ''],
    list: (config) => [
      ...keys.resourceAll,
      'list',
      { ...config, ...metaData } as QueryKey,
    ],
    many: (ids) =>
      [
        ...keys.resourceAll,
        'getMany',
        (ids && ids.map(String)) as QueryKey,
        { ...metaData } as QueryKey,
      ].filter((item) => item !== undefined),
    detail: (id) => [
      ...keys.resourceAll,
      'detail',
      id?.toString(),
      { ...metaData } as QueryKey,
    ],
    logList: (meta) =>
      ['logList', resource, meta as any, metaData as QueryKey].filter(
        (item) => item !== undefined
      ),
  };
  return keys;
};
