import { UseMutationOptions } from '@tanstack/react-query';
import { Button, ButtonProps } from 'antd';
import { Fragment } from 'react';
import { useListContext } from '../../context';
import { useResourceContext } from '../../context/ResourceContext';
import { useDeleteWithConfirmController } from '../../controller/button/useDeleteWithConfirmController';
import { DeleteParams, RaRecord } from '../../types';
import Confirm from '../layout/Confirm';

export type DeleteWithConfirmButtonProps<RecordType extends RaRecord = any> =
  ButtonProps & {
    label?: string;
    confirmTitle?: string;
    confirmContent?: React.ReactNode;
    record?: any;
    resource?: string;
    mutationOptions?: UseMutationOptions<
      RecordType,
      unknown,
      DeleteParams<RecordType>
    >;
  };

export const DeleteWithConfirmButton = <RecordType extends RaRecord = any>(
  props: DeleteWithConfirmButtonProps<RecordType>
) => {
  const {
    label = '删除',
    record,
    mutationOptions,
    confirmTitle = '删除',
    confirmContent = '确定是否删除该数据？',
    ...buttonProps
  } = props;

  const resource = useResourceContext(props);
  const { setPage, refetch } = useListContext();

  const { open, isLoading, handleDialogClose, handleDelete, handleDialogOpen } =
    useDeleteWithConfirmController({
      record,
      mutationOptions: {
        ...mutationOptions,
        onSuccess(data, variables, context) {
          mutationOptions?.onSuccess?.(data, variables, context);

          setPage(1);
          refetch();
        },
      },
      resource,
    });

  return (
    <Fragment>
      <a
        type="link"
        danger
        {...buttonProps}
        onClick={handleDialogOpen}
        key="button"
      >
        {label}
      </a>
      <Confirm
        key="confirm"
        open={open}
        loading={isLoading}
        title={confirmTitle}
        content={confirmContent}
        onConfirm={handleDelete}
        onClose={handleDialogClose}
      />
    </Fragment>
  );
};

export default DeleteWithConfirmButton;
