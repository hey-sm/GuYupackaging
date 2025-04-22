import { defaults } from 'lodash-es';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { ListControllerResult } from '../controller/list';
import { RaRecord } from '../types';

export const ListContext = createContext<ListControllerResult>({} as any);

export const ListContextProvider = <RecordType extends RaRecord = any>({
  children,
  value,
}: {
  value: ListControllerResult<RecordType>;
  children: ReactNode;
}) => {
  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};

export const useListContext = <RecordType extends RaRecord = any>(
  props?: any
): ListControllerResult<RecordType> => {
  const context = useContext(ListContext);
  return useMemo(
    () =>
      defaults(
        {},
        props != null ? extractListContextProps(props) : {},
        context
      ),
    [context, props]
  );
};
const extractListContextProps = ({
  sort,
  data,
  defaultTitle,
  displayedFilters,
  exporter,
  filterValues,
  hasCreate,
  hideFilter,
  isFetching,
  isLoading,
  onSelect,
  onToggleItem,
  onUnselectItems,
  page,
  perPage,
  refetch,
  resource,
  selectedIds,
  setFilters,
  setPage,
  setPerPage,
  setSort,
  showFilter,
  total,
}: any) => ({
  sort,
  data,
  defaultTitle,
  displayedFilters,
  exporter,
  filterValues,
  hasCreate,
  hideFilter,
  isFetching,
  isLoading,
  onSelect,
  onToggleItem,
  onUnselectItems,
  page,
  perPage,
  refetch,
  resource,
  selectedIds,
  setFilters,
  setPage,
  setPerPage,
  setSort,
  showFilter,
  total,
});
