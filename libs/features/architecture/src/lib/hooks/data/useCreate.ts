import {
  MutateOptions,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { message } from 'antd';
import { useRef } from 'react';
import { CreateParams, RaRecord } from '../../types';
import { useEvent } from '../../utils/useEvent';
import { useDataProvider } from './useDataProvider';

export interface UseCreateMutateParams<RecordType extends RaRecord = any> {
  resource?: string;
  data?: Partial<RecordType>;
  meta?: any;
}

export type UseCreateOptions<
  RecordType extends RaRecord = any,
  MutationError = unknown
> = UseMutationOptions<
  RecordType,
  MutationError,
  Partial<UseCreateMutateParams<RecordType>>
>;

export type UseCreateResult<
  RecordType extends RaRecord = any,
  TReturnPromise extends boolean = boolean,
  MutationError = unknown
> = [
  (
    resource?: string,
    params?: Partial<CreateParams<Partial<RecordType>>>,
    options?: MutateOptions<
      RecordType,
      MutationError,
      Partial<UseCreateMutateParams<RecordType>>,
      unknown
    > & { returnPromise?: TReturnPromise }
  ) => Promise<TReturnPromise extends true ? RecordType : void>,

  UseMutationResult<
    RecordType,
    MutationError,
    Partial<UseCreateMutateParams<RecordType>>,
    unknown
  >
];

export const useCreate = <
  RecordType extends RaRecord = any,
  MutationError = unknown
>(
  resource?: string,
  params: Partial<CreateParams<Partial<RecordType>>> = {},
  options: UseCreateOptions<RecordType, MutationError> = {}
): UseCreateResult<RecordType, boolean, MutationError> => {
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();
  const paramsRef = useRef<Partial<CreateParams<Partial<RecordType>>>>(params);

  const mutation = useMutation<
    RecordType,
    MutationError,
    Partial<UseCreateMutateParams<RecordType>>
  >(
    ({
      resource: callTimeResource = resource as string,
      data: callTimeData = paramsRef.current.data,
      meta: callTimeMeta = paramsRef.current.meta,
    } = {}) =>
      dataProvider
        .create<RecordType>(callTimeResource, {
          data: callTimeData,
          meta: callTimeMeta,
        }).then((res) => {
          if (res?.data) {
            message.success('操作成功')
          }
          return res.data
        }),
    {
      ...options,
      onSuccess: (
        data: RecordType,
        variables: Partial<UseCreateMutateParams<RecordType>> = {},
        context: unknown
      ) => {
        const { resource: callTimeResource = resource } = variables;
        queryClient.setQueryData(
          [callTimeResource, 'getOne', { id: data?.id }],
          data
        );

        options.onSuccess?.(data, variables, context);
        // call-time success callback is executed by react-query
      },
    }
  );

  const create = async (
    callTimeResource: string = resource as string,
    callTimeParams: Partial<CreateParams<Partial<RecordType>>> = {},
    createOptions: MutateOptions<
      RecordType,
      MutationError,
      Partial<UseCreateMutateParams<RecordType>>,
      unknown
    > & { returnPromise?: boolean } = {}
  ) => {
    const { returnPromise, ...reactCreateOptions } = createOptions;
    if (returnPromise) {
      return mutation.mutateAsync(
        { resource: callTimeResource, ...callTimeParams },
        createOptions
      );
    }
    return mutation.mutate(
      { resource: callTimeResource, ...callTimeParams },
      reactCreateOptions
    );
  };

  return [useEvent(create), mutation];
};
