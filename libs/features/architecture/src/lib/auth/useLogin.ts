import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import qs from 'query-string';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, TLoginData } from './AuthContext';

export type UseLoginProps<TVariables> = {
  mutationOptions?: Omit<
    UseMutationOptions<TLoginData, Error, TVariables, unknown>,
    'mutationFn' | 'onError' | 'onSuccess'
  >;
};

export const useLogin = <TVariables = Record<string, never>>({
  mutationOptions,
}: UseLoginProps<TVariables> = {}): UseMutationResult<
  TLoginData,
  Error,
  TVariables,
  unknown
> => {
  const { login: loginFromContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const { search } = useLocation();
  const { to } = qs.parse(search);

  const queryResponse = useMutation<TLoginData, Error, TVariables, unknown>(
    ['useLogin'],
    loginFromContext,
    {
      onSuccess(redirectPathFromAuth) {
        if (to) {
          return navigate(to as string, { replace: true });
        }

        if (redirectPathFromAuth !== false) {
          if (typeof redirectPathFromAuth === 'string') {
            navigate(redirectPathFromAuth, { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      },

      onError(error) {
        // TODO show error
      },
      ...mutationOptions,
    }
  );

  return queryResponse;
};
