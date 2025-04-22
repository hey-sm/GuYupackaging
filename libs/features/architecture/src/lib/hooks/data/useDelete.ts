import {
  MutateOptions,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useRef } from 'react';
import { DeleteParams, RaRecord, Snapshot } from '../../types';
import { useEvent } from '../../utils/useEvent';
import { useDataProvider } from './useDataProvider';

export interface UseDeleteMutateParams<RecordType extends RaRecord = any> {
  resource?: string;
  id?: string;
  data?: Partial<RecordType>;
  previousData?: any;
  meta?: any;
}

export type UseDeleteOptions<
  RecordType extends RaRecord = any,
  MutationError = unknown
> = UseMutationOptions<
  RecordType,
  MutationError,
  Partial<UseDeleteMutateParams<RecordType>>
>;

export type UseDeleteResult<
  RecordType extends RaRecord = any,
  MutationError = unknown
> = [
  (
    resource?: string,
    params?: Partial<DeleteParams<RecordType>>,
    options?: MutateOptions<
      RecordType,
      MutationError,
      Partial<UseDeleteMutateParams<RecordType>>,
      unknown
    >
  ) => Promise<void>,
  UseMutationResult<
    RecordType,
    MutationError,
    Partial<DeleteParams<RecordType> & { resource?: string }>,
    unknown
  >
];

export const useDelete = <
  RecordType extends RaRecord = any,
  MutationError = unknown
>(
  resource?: string,
  params: Partial<DeleteParams<RecordType>> = {},
  options: UseDeleteOptions<RecordType, MutationError> = {}
): UseDeleteResult<RecordType, MutationError> => {
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();
  const { previousData } = params;

  const reactMutationOptions = options;

  const paramsRef = useRef<Partial<DeleteParams<RecordType>>>(params);
  const snapshot = useRef<Snapshot>([]);

  const mutation = useMutation<
    RecordType,
    MutationError,
    Partial<UseDeleteMutateParams<RecordType>>
  >(
    ({
      resource: callTimeResource = resource as string,
      id: callTimeId = paramsRef.current.id,
      previousData: callTimePreviousData = paramsRef.current.previousData,
      meta: callTimeMeta = paramsRef.current.meta,
    } = {}) =>
      dataProvider
        .delete<RecordType>(callTimeResource, {
          id: callTimeId as string,
          previousData: callTimePreviousData,
          meta: callTimeMeta,
        })
        .then(({ data }) => data),
    {
      ...reactMutationOptions,
      onMutate: async (
        variables: Partial<UseDeleteMutateParams<RecordType>>
      ) => {
        if (reactMutationOptions.onMutate) {
          const userContext =
            (await reactMutationOptions.onMutate(variables)) || {};
          return {
            snapshot: snapshot.current,
            ...userContext,
          };
        } else {
          return { snapshot: snapshot.current };
        }
      },
      onError: (
        error: MutationError,
        variables: Partial<UseDeleteMutateParams<RecordType>> = {},
        context: any
      ) => {
        context?.snapshot.forEach(([key, value]: any) => {
          queryClient.setQueryData(key, value);
        });

        return reactMutationOptions.onError?.(error, variables, context);
      },
      onSuccess: (
        data: RecordType,
        variables: Partial<UseDeleteMutateParams<RecordType>> = {},
        context: unknown
      ) => {
        reactMutationOptions.onSuccess?.(data, variables, context);
      },
      onSettled: (data, error, variables, context: any) => {
        // Always refetch after error or success:
        context.snapshot.forEach(([key]: any) => {
          queryClient.invalidateQueries(key);
        });

        return reactMutationOptions.onSettled?.(
          data,
          error,
          variables,
          context
        );
      },
    }
  );

  const mutate = async (
    callTimeResource: string = resource as string,
    callTimeParams: Partial<DeleteParams<RecordType>> = {},
    updateOptions: MutateOptions<
      RecordType,
      MutationError,
      Partial<UseDeleteMutateParams<RecordType>>,
      unknown
    > = {}
  ) => {
    const { onSuccess, onSettled, onError } = updateOptions;

    paramsRef.current = params;

    const { previousData: callTimePreviousData = previousData as RecordType } =
      callTimeParams;

    const queryKeys = [
      [callTimeResource, 'getList'],
      [callTimeResource, 'getMany'],
      [callTimeResource, 'getManyReference'],
    ];

    snapshot.current = queryKeys.reduce(
      (prev, curr) => prev.concat(queryClient.getQueriesData(curr)),
      [] as Snapshot
    );

    // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
    await Promise.all(
      snapshot.current.map(([key]) => queryClient.cancelQueries(key))
    );

    if (reactMutationOptions.onSuccess) {
      setTimeout(
        () =>
          reactMutationOptions.onSuccess?.(
            callTimePreviousData,
            { resource: callTimeResource, ...callTimeParams },
            { snapshot: snapshot.current }
          ),
        0
      );
    }

    // call the mutate method without success side effects
    return mutation.mutate(
      { resource: callTimeResource, ...callTimeParams },
      { onSuccess, onSettled, onError }
    );
  };

  return [useEvent(mutate), mutation];
};
