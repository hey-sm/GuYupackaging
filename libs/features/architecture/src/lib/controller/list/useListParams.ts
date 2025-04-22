import { debounce } from 'lodash-es';
import { useState, useRef, useMemo, useCallback } from 'react';
import { useMountedState } from 'react-use';
import { FilterPayload, SortPayload } from '../../types';

import queryReducer, {
  ActionTypes,
  HIDE_FILTER,
  SET_FILTER,
  SET_PAGE,
  SET_PER_PAGE,
  SET_SORT,
  SHOW_FILTER,
  SORT_ASC,
} from './queryReducer';

export interface ListParamsOptions {
  debounce?: number;
  // Whether to disable the synchronization of the list parameters with
  // the current location (URL search parameters)
  disableSyncWithLocation?: boolean;
  // default value for a filter when displayed but not yet set
  filterDefaultValues?: FilterPayload;
  perPage?: number;
  resource: string;
  sort?: SortPayload;
  storeKey?: string;
}

export interface ListParams {
  sort: string;
  order: string;
  page: number;
  perPage: number;
  filter: any;
  displayedFilters: any;
}

interface Parameters extends ListParams {
  filterValues: object;
  displayedFilters: any;
  requestSignature: any[];
}

interface Modifiers {
  changeParams: (action: any) => void;
  setPage: (page: number, perPage?: number) => void;
  setPerPage: (perPage: number) => void;
  setSort: (sort: SortPayload) => void;
  setFilters: (filters: any, displayedFilters: any) => void;
  hideFilter: (filterName: string) => void;
  showFilter: (filterName: string, defaultValue: any) => void;
}

export const useListParams = ({
  debounce: debounceProp = 500,
  filterDefaultValues,
  perPage = 10,
  resource,
  sort = defaultSort,
  storeKey = `${resource}.listParams`,
}: ListParamsOptions): [Parameters, Modifiers] => {
  const [localParams, setLocalParams] = useState(defaultParams);

  const tempParams = useRef<ListParams>();
  const isMounted = useMountedState();

  const requestSignature = [
    resource,
    storeKey,
    JSON.stringify(localParams),
    JSON.stringify(filterDefaultValues),
    JSON.stringify(sort),
    perPage,
  ];

  const query = useMemo(
    () =>
      getQuery({
        params: localParams,
        filterDefaultValues,
        sort,
        perPage,
      }),
    requestSignature // eslint-disable-line react-hooks/exhaustive-deps
  );

  const changeParams = useCallback((action: ActionTypes) => {
    // do not change params if the component is already unmounted
    // this is necessary because changeParams can be debounced, and therefore
    // executed after the component is unmounted
    if (!isMounted) return;

    if (!tempParams.current) {
      // no other changeParams action dispatched this tick
      const temp = (tempParams.current = queryReducer(query, action) || {});

      // schedule side effects for next tick
      setLocalParams(temp);
      tempParams.current = undefined;
    } else {
      // side effects already scheduled, just change the params
      tempParams.current = queryReducer(tempParams.current, action);
    }
  }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

  const setSort = useCallback(
    (sort: SortPayload) =>
      changeParams({
        type: SET_SORT,
        payload: sort as any,
      }),
    [changeParams]
  );

  const setPage = useCallback(
    (newPage: number, newPerPage?: number) =>
      changeParams({
        type: SET_PAGE,
        payload: { page: newPage, perPage: newPerPage },
      }),
    requestSignature // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setPerPage = useCallback(
    (newPerPage: number) =>
      changeParams({ type: SET_PER_PAGE, payload: newPerPage }),
    requestSignature // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filterValues = query.filter || {};

  const debouncedSetFilters = debounce((filter, displayedFilters) => {
    changeParams({
      type: SET_FILTER,
      payload: {
        filter,
        displayedFilters,
      },
    });
  }, debounceProp);

  const setFilters = useCallback(
    (filter: any, displayedFilters: any, debounce = true) =>
      debounce
        ? debouncedSetFilters(filter, displayedFilters)
        : changeParams({
            type: SET_FILTER,
            payload: {
              filter,
              displayedFilters,
            },
          }),
    requestSignature // eslint-disable-line react-hooks/exhaustive-deps
  );

  const hideFilter = useCallback((filterName: string) => {
    changeParams({
      type: HIDE_FILTER,
      payload: filterName,
    });
  }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

  const showFilter = useCallback((filterName: string, defaultValue: any) => {
    changeParams({
      type: SHOW_FILTER,
      payload: {
        filterName,
        defaultValue,
      },
    });
  }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

  return [
    {
      filterValues,
      requestSignature,
      ...query,
      displayedFilters: query.displayedFilters ?? {},
    },
    {
      changeParams,
      setPage,
      setPerPage,
      setSort,
      setFilters,
      hideFilter,
      showFilter,
    },
  ];
};

export const validQueryParams = [
  'page',
  'perPage',
  'sort',
  'order',
  'filter',
  'displayedFilters',
];

export const hasCustomParams = (params: ListParams) => {
  return (
    params &&
    params.filter &&
    (Object.keys(params.filter).length > 0 ||
      params.order != null ||
      params.page !== 1 ||
      params.perPage != null ||
      params.sort != null)
  );
};

export const getQuery = ({
  params,
  filterDefaultValues,
  sort,
  perPage,
}: any) => {
  const query: Partial<ListParams> = hasCustomParams(params)
    ? { ...params }
    : { filter: filterDefaultValues || {} };

  if (!query.sort) {
    query.sort = sort.field;
    query.order = sort.order;
  }

  if (query.perPage == null) {
    query.perPage = perPage;
  }
  if (query.page == null) {
    query.page = 1;
  }

  return {
    ...query,
    page: getNumberOrDefault(query.page, 1),
    perPage: getNumberOrDefault(query.perPage, 10),
  } as ListParams;
};

export const getNumberOrDefault = (
  possibleNumber: string | number | undefined,
  defaultValue: number
) => {
  const parsedNumber: any =
    typeof possibleNumber === 'string'
      ? parseInt(possibleNumber, 10)
      : possibleNumber;

  return isNaN(parsedNumber) ? defaultValue : parsedNumber;
};

const defaultParams = {};

const defaultSort = {
  field: 'id',
  order: SORT_ASC,
};
