import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import qs from 'query-string';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdatePasswordFormTypes } from '../types';
import { AuthContext, IAuthContext, TUpdatePasswordData } from './AuthContext';

export type UseUpdatePasswordProps<TVariables extends UpdatePasswordFormTypes> =
  {
    mutationOptions?: Omit<
      UseMutationOptions<TUpdatePasswordData, Error, TVariables, unknown>,
      'mutationFn' | 'onError' | 'onSuccess'
    >;
  };

export const useUpdatePassword = <
  TVariables extends UpdatePasswordFormTypes = Record<string, any>
>({
  mutationOptions,
}: UseUpdatePasswordProps<TVariables> = {}): UseMutationResult<
  TUpdatePasswordData,
  Error,
  TVariables,
  unknown
> => {
  const navigate = useNavigate();
  const { updatePassword: updatePasswordFromContext } =
    React.useContext<IAuthContext>(AuthContext);

  const { search } = useLocation();

  const queryStrings = qs.parse(search);

  const queryResponse = useMutation<
    TUpdatePasswordData,
    Error,
    TVariables,
    unknown
  >(
    ['useUpdatePassword'],
    async (variables) => {
      return updatePasswordFromContext?.({
        ...queryStrings,
        ...variables,
      });
    },
    {
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
    }
  );

  return queryResponse;
};
