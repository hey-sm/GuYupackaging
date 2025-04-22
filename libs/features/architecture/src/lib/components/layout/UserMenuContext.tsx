import { createContext, FC, ReactNode, useContext } from 'react';

export const UserMenuContext = createContext<UserMenuContextValue | undefined>(
  undefined
);

export type UserMenuContextValue = {
  /**
   * Closes the user menu
   * @see UserMenu
   */
  onClose: () => void;
};

export const UserMenuContextProvider: FC<{
  value: UserMenuContextValue;
  children: ReactNode;
}> = ({ children, value }) => (
  <UserMenuContext.Provider value={value}>{children}</UserMenuContext.Provider>
);

export type UserMenuContextProviderProps = {
  children: ReactNode;
  value: UserMenuContextValue;
};

export const useUserMenu = () =>
  useContext(UserMenuContext) as UserMenuContextValue;
