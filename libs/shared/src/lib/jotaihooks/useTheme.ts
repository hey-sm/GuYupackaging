import { atom, useAtom } from 'jotai';

export type theme = 'light' | 'dark';

export const themeAtom = atom<theme>('light');

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  return {
    theme,
    setTheme,
  };
};
