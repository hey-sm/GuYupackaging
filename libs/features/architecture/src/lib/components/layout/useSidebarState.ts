import { atom, useAtom } from 'jotai';

export const sidebarAtom = atom(false);

export const useSidebarState = () => {
  return useAtom(sidebarAtom);
};
