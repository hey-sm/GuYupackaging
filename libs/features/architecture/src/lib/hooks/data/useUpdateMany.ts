import {
  MutateOptions,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { useRef } from 'react';

import { RaRecord, UpdateManyParams } from '../../types';
import { useEvent } from '../../utils/useEvent';
import { useDataProvider } from './useDataProvider';

type Snapshot = [key: QueryKey, value: any][];

export interface UseUpdateManyMutateParams<RecordType extends RaRecord = any> {
  resource?: string;
  ids?: Array<string>;
  data?: Partial<RecordType>;
  previousData?: any;
  meta?: any;
}

export type UseUpdateManyOptions<RecordType extends RaRecord = any, MutationError = unknown> = UseMutationOptions<
  Array<string>,
  MutationError,
  Partial<UseUpdateManyMutateParams<RecordType>>
>;

export type UseUpdateManyResult<
  RecordType extends RaRecord = any,
  TReturnPromise extends boolean = boolean,
  MutationError = unknown
> = [
  (
    resource?: string,
    params?: Partial<UpdateManyParams<RecordType>>,
    options?: MutateOptions<Array<string>, MutationError, Partial<UseUpdateManyMutateParams<RecordType>>, unknown> & {
      returnPromise?: TReturnPromise;
    }
  ) => Promise<TReturnPromise extends true ? Array<string> : void>,
  UseMutationResult<
    Array<string>,
    MutationError,
    Partial<UpdateManyParams<Partial<RecordType>> & { resource?: string }>,
    unknown
  >
];

export const useUpdateMany = <RecordType extends RaRecord = any, MutationError = unknown>(
  resource?: string,
  params: Partial<UpdateManyParams<Partial<RecordType>>> = {},
  options: UseUpdateManyOptions<RecordType, MutationError> = {}
): UseUpdateManyResult<RecordType, boolean, MutationError> => {
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();
  const { ids } = params;
  const reactMutationOptions = options;
  const paramsRef = useRef<Partial<UpdateManyParams<Partial<RecordType>>>>(params);

  const snapshot = useRef<Snapshot>([]);

  const mutation = useMutation<Array<string>, MutationError, Partial<UseUpdateManyMutateParams<RecordType>>>(
    ({
      resource: callTimeResource = resource as string,
      ids: callTimeIds = paramsRef.current.ids,
      data: callTimeData = paramsRef.current.data,
      meta: callTimeMeta = paramsRef.current.meta,
    } = {}) =>
      dataProvider
        .updateMany(callTimeResource, {
          ids: callTimeIds as string[],
          data: callTimeData,
          meta: callTimeMeta,
        })
        .then(({ data }) => data as any),
    {
      ...reactMutationOptions,
      onMutate: async (variables: Partial<UseUpdateManyMutateParams<RecordType>>) => {
        if (reactMutationOptions.onMutate) {
          const userContext = (await reactMutationOptions.onMutate(variables)) || {};
          return {
            snapshot: snapshot.current,

            ...userContext,
          };
        } else {
          // Return a context object with the snapshot value
          return { snapshot: snapshot.current };
        }
      },
      onError: (error: MutationError, variables: Partial<UseUpdateManyMutateParams<RecordType>> = {}, context: any) => {
        // If the mutation fails, use the context returned from onMutate to rollback
        context?.snapshot.forEach(([key, value]: any[]) => {
          queryClient.setQueryData(key, value);
        });

        if (reactMutationOptions.onError) {
          return reactMutationOptions.onError(error, variables, context);
        }
        // call-time error callback is executed by react-query
      },
      onSuccess: (
        data: Array<string>,
        variables: Partial<UseUpdateManyMutateParams<RecordType>> = {},
        context: unknown
      ) => {
        reactMutationOptions.onSuccess?.(data, variables, context);
        // call-time success callback is executed by react-query
      },

      onSettled(data, error, variables, context: any) {
        context.snapshot.forEach(([key]: any) => {
          queryClient.invalidateQueries(key);
        });

        if (reactMutationOptions.onSettled) {
          return reactMutationOptions.onSettled(data, error, variables, context);
        }
      },
    }
  );

  const updateMany = async (
    callTimeResource: string = resource as string,
    callTimeParams: Partial<UpdateManyParams<RecordType>> = {},
    updateOptions: MutateOptions<
      Array<string>,
      MutationError,
      Partial<UseUpdateManyMutateParams<RecordType>>,
      unknown
    > & { returnPromise?: boolean } = {}
  ) => {
    const { onSuccess, onSettled, onError } = updateOptions;

    // store the hook time params *at the moment of the call*
    // because they may change afterwards, which would break the undoable mode
    // as the previousData would be overwritten by the optimistic update
    paramsRef.current = params;

    const { ids: callTimeIds = ids } = callTimeParams;

    // optimistic update as documented in https://react-query-v3.tanstack.com/guides/optimistic-updates
    // except we do it in a mutate wrapper instead of the onMutate callback
    // to have access to success side effects

    const queryKeys = [
      [callTimeResource, 'getOne'],
      [callTimeResource, 'getList'],
      [callTimeResource, 'getMany'],
      [callTimeResource, 'getManyReference'],
    ];

    snapshot.current = queryKeys.reduce((prev, curr) => prev.concat(queryClient.getQueriesData(curr)), [] as Snapshot);

    // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
    await Promise.all(snapshot.current.map(([key]) => queryClient.cancelQueries(key)));

    // run the success callbacks during the next tick
    if (onSuccess) {
      setTimeout(
        () =>
          onSuccess(
            callTimeIds as string[],
            { resource: callTimeResource, ...callTimeParams },
            { snapshot: snapshot.current }
          ),
        0
      );
    }
    if (reactMutationOptions.onSuccess) {
      setTimeout(
        () =>
          reactMutationOptions.onSuccess?.(
            callTimeIds as string[],
            { resource: callTimeResource, ...callTimeParams },
            { snapshot: snapshot.current }
          ),
        0
      );
    }

    // call the mutate method without success side effects
    return mutation.mutate({ resource: callTimeResource, ...callTimeParams }, { onSettled, onError });
  };

  return [useEvent(updateMany), mutation];
};
