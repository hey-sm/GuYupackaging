import { useCallback } from 'react';
import { useRecordSelection } from './useRecordSelection';

export const useUnselectAll = (resource: string) => {
  const [, { clearSelection }] = useRecordSelection(resource);
  return useCallback(() => {
    clearSelection();
  }, [clearSelection]);
};
