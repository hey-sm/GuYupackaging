import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useContext } from 'react';
import { IAuthContext, AuthContext } from './AuthContext';
import { useLogout } from './useLogout';

export const useCheckError = (): UseMutationResult<
  void,
  string | undefined,
  any,
  unknown
> => {
  const { checkError: checkErrorFromContext } =
    useContext<IAuthContext>(AuthContext);

  const { mutate: logout } = useLogout();

  const queryResponse = useMutation(['useCheckError'], checkErrorFromContext, {
    onError: (redirectPath?: string) => {
      logout({ redirectPath });
    },
  });

  return queryResponse;
};
