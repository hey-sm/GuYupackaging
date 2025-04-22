import { UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import defaultExporter from '../../export/defaultExporter';
import { useGetList, UseGetListHookValue } from '../../hooks/data/useGetList';
import { Exporter, FilterPayload, RaRecord, SortPayload } from '../../types';
import { SORT_ASC } from './queryReducer';
import { useListParams } from './useListParams';
import { useRecordSelection } from './useRecordSelection';

export interface ListControllerProps<RecordType extends RaRecord = any> {
  debounce?: number;
  disableSyncWithLocation?: boolean;
  exporter?: Exporter | false;
  filter?: FilterPayload;
  filterDefaultValues?: object;
  perPage?: number;
  queryOptions?: UseQueryOptions<{
    data: RecordType[];
    total?: number;
    pageInfo?: {
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
  }> & { meta?: any };
  resource?: string;
  sort?: SortPayload;
}

export interface ListControllerResult<RecordType extends RaRecord = any> {
  sort: SortPayload;
  data: RecordType[];
  defaultTitle?: string;
  displayedFilters: any;
  error?: any;
  exporter?: Exporter | false;
  filter?: FilterPayload;
  filterValues: any;
  hideFilter: (filterName: string) => void;
  isFetching: boolean;
  isLoading: boolean;
  onSelect: (ids: string[]) => void;
  onToggleItem: (id: string) => void;
  onUnselectItems: () => void;
  page: number;
  perPage: number;
  refetch: (() => void) | UseGetListHookValue<RecordType>['refetch'];
  resource: string;
  selectedIds: RecordType['id'][];
  setFilters: (filters: any, displayedFilters: any, debounce?: boolean) => void;
  setPage: (page: number, perPage?: number) => void;
  setPerPage: (page: number) => void;
  setSort: (sort: SortPayload) => void;
  showFilter: (filterName: string, defaultValue: any) => void;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const useListController = <RecordType extends RaRecord = any>(
  props: ListControllerProps<RecordType> = {}
): ListControllerResult<RecordType> => {
  const {
    resource,
    exporter = defaultExporter,
    filterDefaultValues,
    sort = defaultSort,
    perPage = 10,
    filter,
    debounce = 500,
    disableSyncWithLocation,
    queryOptions = {},
  } = props;

  const { meta, ...otherQueryOptions } = queryOptions;

  const [query, queryModifiers] = useListParams({
    resource: resource as string,
    filterDefaultValues,
    sort,
    perPage,
    debounce,
    disableSyncWithLocation,
  });

  const [selectedIds, selectionModifiers] = useRecordSelection(resource as string);

  const {
    data = [],
    pageInfo,
    total = 0,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetList<RecordType>(
    resource as string,
    {
      pagination: {
        page: query.page,
        perPage: query.perPage,
      },
      sort: { field: query.sort, order: query.order },
      filter: { ...query.filter, ...filter },
      meta,
    },
    {
      keepPreviousData: true,
      retry: false,
      ...(otherQueryOptions as any),
    }
  );

  // change page if there is no data
  useEffect(() => {
    if (query.page <= 0 || (!isFetching && query.page > 1 && data.length === 0)) {
      // Query for a page that doesn't exist, set page to 1
      queryModifiers.setPage(1);
      return;
    }
    if (total == null) {
      return;
    }
    const totalPages = Math.ceil(total / query.perPage) || 1;
    if (!isFetching && query.page > totalPages) {
      // Query for a page out of bounds, set page to the last existing page
      // It occurs when deleting the last element of the last page
      queryModifiers.setPage(totalPages);
    }
  }, [isFetching, query.page, query.perPage, data, queryModifiers, total]);

  const currentSort = useMemo(
    () => ({
      field: query.sort,
      order: query.order,
    }),
    [query.sort, query.order]
  );

  return {
    sort: currentSort,
    data,
    displayedFilters: query.displayedFilters,
    error,
    exporter,
    filter,
    filterValues: query.filterValues,
    hideFilter: queryModifiers.hideFilter,
    isFetching,
    isLoading,
    onSelect: selectionModifiers.select,
    onToggleItem: selectionModifiers.toggle,
    onUnselectItems: selectionModifiers.clearSelection,
    page: query.page,
    perPage: query.perPage,
    refetch,
    resource: resource as string,
    selectedIds,
    setFilters: queryModifiers.setFilters,
    setPage: queryModifiers.setPage,
    setPerPage: queryModifiers.setPerPage,
    setSort: queryModifiers.setSort,
    showFilter: queryModifiers.showFilter,
    total: total,
    hasNextPage: pageInfo ? !!pageInfo.hasNextPage : total != null ? query.page * query.perPage < total : false,
    hasPreviousPage: pageInfo ? !!pageInfo.hasPreviousPage : query.page > 1,
  };
};

const defaultSort = {
  field: 'id',
  order: SORT_ASC,
};
