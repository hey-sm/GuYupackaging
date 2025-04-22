import { UseMutationOptions } from '@tanstack/react-query';
import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useDelete } from '../../hooks';
import { DeleteParams, RaRecord } from '../../types';

export interface UseDeleteWithConfirmControllerParams<
  RecordType extends RaRecord = any,
  MutationOptionsError = unknown
> {
  record?: RecordType;
  resource?: string;
  mutationOptions?: UseMutationOptions<
    RecordType,
    MutationOptionsError,
    DeleteParams<RecordType>
  >;
}

export interface UseDeleteWithConfirmControllerReturn {
  open: boolean;
  isLoading: boolean;
  handleDialogOpen: () => void;
  handleDialogClose: () => void;
  handleDelete: () => void;
}

export const useDeleteWithConfirmController = <
  RecordType extends RaRecord = any
>(
  props: UseDeleteWithConfirmControllerParams<RecordType>
): UseDeleteWithConfirmControllerReturn => {
  const { record, resource, mutationOptions = {} } = props;

  const { meta: mutationMeta, ...otherMutationOptions } = mutationOptions;

  const [open, setOpen] = useState(false);
  // TODO
  // const unselect = useUnselect(resource);
  const [deleteOne, { isLoading }] = useDelete<RecordType>();

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDelete = useCallback(() => {
    deleteOne(
      resource,
      {
        id: record?.id as string,
        previousData: record,
        meta: mutationMeta,
      },
      {
        ...(otherMutationOptions as any),
        onSuccess: (data, variables: any, context) => {
          setOpen(false);
          message.success('操作成功');
          otherMutationOptions?.onSuccess?.(data, variables, context);
          // notify('ra.notification.deleted', {
          //   type: 'info',
          //   messageArgs: { smart_count: 1 },
          //   undoable: mutationMode === 'undoable',
          // });
          // unselect([record.id]);
        },
        onError: (error, variables: any, context) => {
          setOpen(false);
          otherMutationOptions?.onError?.(error, variables, context);
          // notify(
          //   typeof error === 'string'
          //     ? error
          //     : error.message || 'ra.notification.http_error',
          //   {
          //     type: 'warning',
          //     messageArgs: {
          //       _:
          //         typeof error === 'string'
          //           ? error
          //           : error && error.message
          //           ? error.message
          //           : undefined,
          //     },
          //   }
          // );
        },
      }
    );
  }, [deleteOne, mutationMeta, otherMutationOptions, record, resource]);

  return {
    open,
    isLoading,
    handleDialogOpen,
    handleDialogClose,
    handleDelete,
  };
};
