import {
  MutateOptions,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { message } from 'antd';
import { useRef } from 'react';
import { RaRecord, UpdateParams } from '../../types';
import { useEvent } from '../../utils/useEvent';
import { useDataProvider } from './useDataProvider';

export interface UseUpdateMutateParams<RecordType extends RaRecord = any> {
  resource?: string;
  id?: string;
  data?: Partial<RecordType>;
  previousData?: any;
  meta?: any;
}

export type UseUpdateOptions<
  RecordType extends RaRecord = any,
  MutationError = unknown
> = UseMutationOptions<
  RecordType,
  MutationError,
  Partial<UseUpdateMutateParams<RecordType>>
>;

export type UseUpdateResult<
  RecordType extends RaRecord = any,
  TReturnPromise extends boolean = boolean,
  MutationError = unknown
> = [
  (
    resource?: string,
    params?: Partial<UpdateParams<RecordType>>,
    options?: MutateOptions<
      RecordType,
      MutationError,
      Partial<UseUpdateMutateParams<RecordType>>,
      unknown
    > & { returnPromise?: TReturnPromise }
  ) => Promise<TReturnPromise extends true ? RecordType : void>,
  UseMutationResult<
    RecordType,
    MutationError,
    Partial<UpdateParams<RecordType> & { resource?: string }>,
    unknown
  >
];

type Snapshot = [key: QueryKey, value: any][];

export const useUpdate = <
  RecordType extends RaRecord = any,
  MutationError = unknown
>(
  resource?: string,
  params: Partial<UpdateParams<RecordType>> = {},
  options: UseUpdateOptions<RecordType, MutationError> = {}
): UseUpdateResult<RecordType, boolean, MutationError> => {
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();

  const { id, data, meta } = params;

  const reactMutationOptions = options;

  const paramsRef = useRef<Partial<UpdateParams<RecordType>>>(params);
  const snapshot = useRef<Snapshot>([]);

  const mutation = useMutation<
    RecordType,
    MutationError,
    Partial<UseUpdateMutateParams<RecordType>>,
    { snapshot: Snapshot }
  >(
    ({
      resource: callTimeResource = resource as string,
      id: callTimeId = paramsRef.current.id,
      data: callTimeData = paramsRef.current.data,
      meta: callTimeMeta = paramsRef.current.meta,
      previousData: callTimePreviousData = paramsRef.current.previousData,
    } = {}) =>
      dataProvider
        .update<RecordType>(callTimeResource, {
          id: callTimeId as string,
          data: callTimeData as any,
          previousData: callTimePreviousData,
          meta: callTimeMeta,
        })
        .then((props) => {
          if (props?.data) {
            message.success('操作成功')
          }
          return props.data
        }),
    {
      ...reactMutationOptions,
      onMutate: async (
        variables: Partial<UseUpdateMutateParams<RecordType>>
      ) => {
        if (reactMutationOptions.onMutate) {
          const userContext =
            (await reactMutationOptions.onMutate(variables)) || {};
          return {
            snapshot: snapshot.current,
            ...userContext,
          };
        } else {
          // Return a context object with the snapshot value
          return { snapshot: snapshot.current };
        }
      },
      onError(error, variables, context) {
        // If the mutation fails, use the context returned from onMutate to rollback
        context?.snapshot.forEach(([key, value]) => {
          queryClient.setQueryData(key, value);
        });

        if (reactMutationOptions.onError) {
          return reactMutationOptions.onError(error, variables, context);
        }
      },
      onSuccess(data, variables, context) {
        if (reactMutationOptions.onSuccess) {
          reactMutationOptions.onSuccess(data, variables, context);
        }
        // call-time success callback is executed by react-query
      },
      onSettled(data, error, variables, context) {
        // Always refetch after error or success:
        context?.snapshot.forEach(([key]) => {
          queryClient.invalidateQueries(key);
        });

        if (reactMutationOptions.onSettled) {
          return reactMutationOptions.onSettled(
            data,
            error,
            variables,
            context
          );
        }
      },
    }
  );

  const update = async (
    callTimeResource: string = resource as string,
    callTimeParams: Partial<UpdateParams<RecordType>> = {},
    updateOptions: MutateOptions<
      RecordType,
      MutationError,
      Partial<UseUpdateMutateParams<RecordType>>,
      unknown
    > & { returnPromise?: boolean } = {}
  ) => {
    const { onSuccess, onSettled, onError } = updateOptions;

    paramsRef.current = params;

    const {
      id: callTimeId = id,
      data: callTimeData = data,
      meta: callTimeMeta = meta,
    } = callTimeParams;

    // optimistic update as documented in https://react-query-v3.tanstack.com/guides/optimistic-updates
    // except we do it in a mutate wrapper instead of the onMutate callback
    // to have access to success side effects

    const previousRecord = queryClient.getQueryData<RecordType>([
      callTimeResource,
      'getOne',
      { id: String(callTimeId), meta: callTimeMeta },
    ]);

    const queryKeys = [
      [
        callTimeResource,
        'getOne',
        { id: String(callTimeId), meta: callTimeMeta },
      ],
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

    // Optimistically update to the new value
    // TODO
    // updateCache({
    //   resource: callTimeResource,
    //   id: callTimeId,
    //   data: callTimeData,
    // });

    // run the success callbacks during the next tick
    if (onSuccess) {
      setTimeout(
        () =>
          onSuccess(
            {
              ...((previousRecord as any) ?? {}),
              ...((callTimeData as any) ?? {}),
            },
            { resource: callTimeResource, ...callTimeParams },
            { snapshot: snapshot.current }
          ),
        0
      );
    }
    if (reactMutationOptions?.onSuccess) {
      setTimeout(
        () =>
          reactMutationOptions.onSuccess?.(
            {
              ...((previousRecord as any) ?? {}),
              ...((callTimeData as any) ?? {}),
            },
            { resource: callTimeResource, ...callTimeParams },
            { snapshot: snapshot.current }
          ),
        0
      );
    }

    // call the mutate method without success side effects
    return mutation.mutate(
      { resource: callTimeResource, ...callTimeParams },
      { onSettled, onError }
    );
  };

  return [useEvent(update), mutation];
};
