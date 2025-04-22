import { useAtomValue } from 'jotai';
import { resourcesAtom } from '../../atoms';

export const useResources = () => {
  return useAtomValue(resourcesAtom);
};
