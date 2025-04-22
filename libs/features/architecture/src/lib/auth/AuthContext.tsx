import { useQueryClient } from '@tanstack/react-query';
import { createContext, FC, ReactNode } from 'react';

export type TLogoutData = void | false | string;
export type TLoginData = void | false | string | object;
export type TRegisterData = void | false | string;
export type TForgotPasswordData = void | false | string;
export type TUpdatePasswordData = void | false | string;

export interface Route {
  id: string;
  code: string;
  name: string;
  path: string;
}

export interface AuthProvider {
  login: (params: any) => Promise<TLoginData>;
  register?: (params: any) => Promise<TRegisterData>;
  forgotPassword?: (params: any) => Promise<TForgotPasswordData>;
  updatePassword?: (params: any) => Promise<TUpdatePasswordData>;
  logout: (params: any) => Promise<TLogoutData>;
  checkAuth: (params?: any) => Promise<any>;
  checkError: (error: any) => Promise<void>;
  getPermissions?: (params?: any) => Promise<any>;
  getUserIdentity?: (params?: any) => Promise<any>;
  getMenus?: (params?: any) => Promise<any[]>;
}

export type IAuthContext = Partial<AuthProvider>;

export const AuthContext = createContext<IAuthContext>({});

export const AuthContextProvider: FC<IAuthContext & { children?: ReactNode }> = ({ children, ...authOperations }) => {
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  const invalidateAuthStore = () => {
    queryClient.invalidateQueries(['useAuthenticated']);
    queryClient.invalidateQueries(['getUserIdentity']);
    queryClient.invalidateQueries(['usePermissions']);
    queryClient.invalidateQueries(['getMenus']);
  };

  const loginFunc = async (params: any) => {
    try {
      const result = await authOperations.login?.(params);

      invalidateAuthStore();

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const registerFunc = async (params: any) => {
    try {
      const result = await authOperations.register?.(params);

      invalidateAuthStore();
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logoutFunc = async (params: any) => {
    try {
      const redirectPath = await authOperations.logout?.(params);

      invalidateAuthStore();

      return Promise.resolve(redirectPath);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const checkAuthFunc = async (params: any) => {
    try {
      await authOperations.checkAuth?.(params);
      return Promise.resolve();
    } catch (error) {
      // if ((error as { redirectPath?: string })?.redirectPath) {
      //   navigate((error as { redirectPath: string }).redirectPath, {
      //     replace: true,
      //   });
      // }

      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authOperations,
        login: loginFunc,
        logout: logoutFunc,
        checkAuth: checkAuthFunc,
        register: registerFunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
