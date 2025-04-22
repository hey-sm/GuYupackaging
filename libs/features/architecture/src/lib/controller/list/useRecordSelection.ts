import { atom, useAtom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { useCallback, useMemo } from 'react';

const selectedIdsAtomFamily = atomFamily(() => atom<string[]>([]));

export const useRecordSelection = (
  resource: string
): [
  string[],
  {
    select: (ids: string[]) => void;
    unselect: (ids: string[]) => void;
    toggle: (id: string) => void;
    clearSelection: () => void;
  }
] => {
  const [ids, setIds] = useAtom(selectedIdsAtomFamily(`${resource}.selectedIds`));

  const reset = useCallback(() => {
    setIds([]);
  }, [setIds]);

  const selectionModifiers = useMemo(
    () => ({
      select: (idsToAdd: string[]) => {
        if (!idsToAdd) return;
        setIds([...idsToAdd]);
      },
      unselect(idsToRemove: string[]) {
        if (!idsToRemove || idsToRemove.length === 0) return;
        setIds((ids: string[]) => {
          if (!Array.isArray(ids)) return [];
          return ids.filter((id) => !idsToRemove.includes(id));
        });
      },
      toggle: (id: string) => {
        if (typeof id === 'undefined') return;
        setIds((ids: string[]) => {
          if (!Array.isArray(ids)) return [...ids];
          const index = ids.indexOf(id);
          return index > -1 ? [...ids.slice(0, index), ...ids.slice(index + 1)] : [...ids, id];
        });
      },
      clearSelection: () => {
        reset();
      },
    }),
    [setIds, reset]
  );

  return [ids, selectionModifiers];
};
