import { atom, useAtom } from 'jotai';

export type collapsed = true | false;

export const collapsedAtom = atom<collapsed>(false);

export const useCollapsed = () => {
  const [collapsed, setCollapsed] = useAtom(collapsedAtom);

  return {
    collapsed,
    setCollapsed,
  };
};
