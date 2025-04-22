import { Button, ButtonProps, message } from 'antd';
import { FC, Fragment, ReactNode, useState } from 'react';
import { useListContext } from '../../context/ListContext';
import { useResourceContext } from '../../context/ResourceContext';
import { useUnselectAll } from '../../controller/list/useUnselectAll';
import { useUpdateMany } from '../../hooks';
import { useRefresh } from '../../hooks/data/useRefresh';
import { BulkActionProps } from '../../types';
import { Confirm } from '../layout';

export interface BulkUpdateWithConfirmButtonProps
  extends BulkActionProps,
    ButtonProps {
  children?: ReactNode;
  confirmContent?: ReactNode;
  confirmTitle?: string;
  data: any;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const BulkUpdateWithConfirmButton: FC<
  BulkUpdateWithConfirmButtonProps
> = (props) => {
  const refresh = useRefresh();
  const resource = useResourceContext(props);
  const unselectAll = useUnselectAll(resource as string);
  const [isOpen, setOpen] = useState(false);
  const { selectedIds } = useListContext(props);

  const {
    confirmTitle = '批量操作',
    confirmContent = '确定此批量操作吗？',
    data,
    children,
    onClick,
    onSuccess = () => {
      refresh();
      message.success('操作成功');
      unselectAll();
      setOpen(false);
    },
    onError = (error: Error | string) => {
      setOpen(false);
    },
    ...rest
  } = props;

  const [updateMany, { isLoading }] = useUpdateMany(
    resource,
    { ids: selectedIds, data },
    {
      onSuccess,
      onError,
    }
  );

  const handleClick = (e: any) => {
    setOpen(true);
    e.stopPropagation();
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    updateMany();
  };

  return (
    <Fragment>
      <Button key="button" onClick={handleClick} {...sanitizeRestProps(rest)}>
        {children}
      </Button>
      <Confirm
        key="confirm"
        open={isOpen}
        loading={isLoading}
        title={confirmTitle}
        content={confirmContent}
        onConfirm={handleUpdate}
        onClose={handleDialogClose}
      />
    </Fragment>
  );
};

const sanitizeRestProps = ({
  selectedIds,
  filterValues,
  onSuccess,
  onError,
  ...rest
}: Omit<BulkUpdateWithConfirmButtonProps, 'resource' | 'data'>) => rest;

export default BulkUpdateWithConfirmButton;
