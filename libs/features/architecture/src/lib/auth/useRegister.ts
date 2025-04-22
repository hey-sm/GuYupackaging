import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, IAuthContext, TRegisterData } from './AuthContext';

export type UseRegisterProps<TVariables> = {
  mutationOptions?: Omit<
    UseMutationOptions<TRegisterData, Error, TVariables, unknown>,
    'mutationFn' | 'onError' | 'onSuccess'
  >;
};

export const useRegister = <TVariables = Record<string, any>>({
  mutationOptions,
}: UseRegisterProps<TVariables> = {}): UseMutationResult<
  TRegisterData,
  Error,
  TVariables,
  unknown
> => {
  const navigate = useNavigate();
  const { register: registerFromContext } =
    React.useContext<IAuthContext>(AuthContext);

  const queryResponse = useMutation<TRegisterData, Error, TVariables, unknown>(
    ['useRegister'],
    registerFromContext,
    {
      onSuccess: (redirectPathFromAuth) => {
        if (redirectPathFromAuth !== false) {
          if (redirectPathFromAuth) {
            navigate(redirectPathFromAuth, { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      },
      onError: (error: any) => {
        // TODO
      },
      ...mutationOptions,
    }
  );

  return queryResponse;
};
