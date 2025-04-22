import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, IAuthContext, TLogoutData } from './AuthContext';

type Variables = {
  redirectPath?: string | false;
};

export type UseLogoutProps<TVariables> = {
  mutationOptions?: Omit<
    UseMutationOptions<
      TLogoutData,
      Error,
      (TVariables & Variables) | void,
      unknown
    >,
    'mutationFn' | 'onError' | 'onSuccess'
  >;
};

export const useLogout = <TVariables = Record<string, any>>({
  mutationOptions,
}: UseLogoutProps<TVariables> = {}): UseMutationResult<
  TLogoutData,
  Error,
  (TVariables & Variables) | void,
  unknown
> => {
  const navigate = useNavigate();
  const { logout: logoutFromContext } = useContext<IAuthContext>(AuthContext);

  const queryResponse = useMutation<
    TLogoutData,
    Error,
    (TVariables & Variables) | void,
    unknown
  >(['useLogout'], logoutFromContext, {
    onSuccess: (data, variables) => {
      const redirectPath = variables?.redirectPath ?? data;

      if (redirectPath === false) {
        return;
      }

      if (redirectPath) {
        navigate(redirectPath);
        return;
      }

      navigate('/login');
    },
    onError: (error: Error) => {
      // TODO
    },
    ...mutationOptions,
  });

  return queryResponse;
};
