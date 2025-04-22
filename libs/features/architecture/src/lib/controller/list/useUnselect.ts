import { useCallback } from 'react';
import { useRecordSelection } from './useRecordSelection';

export const useUnselect = (resource: string) => {
  const [, { unselect }] = useRecordSelection(resource);
  return useCallback(
    (ids: string[]) => {
      unselect(ids);
    },
    [unselect]
  );
};
