import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, IAuthContext, TForgotPasswordData } from './AuthContext';

export type UseForgotPasswordProps<TVariables> = {
  mutationOptions?: Omit<
    UseMutationOptions<TForgotPasswordData, Error, TVariables, unknown>,
    'mutationFn' | 'onError' | 'onSuccess'
  >;
};

export const useForgotPassword = <TVariables = Record<string, any>>({
  mutationOptions,
}: UseForgotPasswordProps<TVariables> = {}): UseMutationResult<
  TForgotPasswordData,
  Error,
  TVariables,
  unknown
> => {
  const navigate = useNavigate();
  const { forgotPassword: forgotPasswordFromContext } =
    React.useContext<IAuthContext>(AuthContext);

  const queryResponse = useMutation<
    TForgotPasswordData,
    Error,
    TVariables,
    unknown
  >(['useForgotPassword'], forgotPasswordFromContext, {
    onSuccess: (redirectPathFromAuth) => {
      if (redirectPathFromAuth !== false) {
        if (redirectPathFromAuth) {
          navigate(redirectPathFromAuth, { replace: true });
        }
      }
    },
    onError: (error: any) => {
      // TODO
    },
    ...mutationOptions,
  });

  return queryResponse;
};
