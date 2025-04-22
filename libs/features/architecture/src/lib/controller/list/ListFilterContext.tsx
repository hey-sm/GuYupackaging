import { pick } from 'lodash-es';
import { createContext, useMemo } from 'react';
import { ListControllerResult } from './useListController';

export type ListFilterContextValue = Pick<
  ListControllerResult,
  | 'displayedFilters'
  | 'filterValues'
  | 'hideFilter'
  | 'setFilters'
  | 'showFilter'
  | 'resource'
>;

export const ListFilterContext = createContext<ListFilterContextValue>(
  {} as ListFilterContextValue
);

export const usePickFilterContext = (
  context: ListControllerResult
): ListFilterContextValue =>
  useMemo(
    () =>
      pick(context, [
        'displayedFilters',
        'filterValues',
        'hideFilter',
        'setFilters',
        'showFilter',
        'resource',
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      context.displayedFilters,
      context.filterValues,
      context.hideFilter,
      context.setFilters,
      context.showFilter,
    ]
  );
