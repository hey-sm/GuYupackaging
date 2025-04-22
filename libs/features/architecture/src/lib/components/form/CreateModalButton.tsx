import { ProForm, ProFormProps } from '@ant-design/pro-components';
import { Button, ButtonProps, Modal, ModalProps } from 'antd';
import { Fragment, PropsWithChildren, ReactNode, useMemo } from 'react';
import styled from 'styled-components';
import { useListContext } from '../../context';
import { useResourceContext } from '../../context/ResourceContext';
import { useModalForm, UseModalFormProps } from '../../hooks/form/useModalForm';
import { RaRecord } from '../../types';

export type CreateModalButtonProps<RecordType extends RaRecord = any> =
  ButtonProps & {
    resource?: string;
    label?: ReactNode;
    record?: any;
    modalProps?: ModalProps;
    formProps?: ProFormProps & { labelWidth?: number };
    modalFormProps?: Omit<UseModalFormProps<RecordType>, 'id' | 'resource'>;
  };

export const CreateModalButton = (
  props: PropsWithChildren<CreateModalButtonProps>
) => {
  const {
    children,
    label,
    record = {},
    modalProps,
    formProps,
    modalFormProps,
    ...buttonProps
  } = props;

  const resource = useResourceContext(props);
  const { setPage, refetch } = useListContext();

  const {
    modalProps: internalModalProps,
    formProps: internalFormProps,
    show,
  } = useModalForm({
    ...modalFormProps,
    resource,
    initialFormValues: record,

    onMutationSuccess() {
      setPage(1);
      refetch();
    },
  });

  const customFormProps = useMemo(() => {
    const props = Object.assign(
      {},
      { ...(formProps ?? {}) },
      {
        layout: formProps?.layout ?? 'horizontal',
        labelCol: {
          flex: `0 0 ${formProps?.labelWidth ?? 80}px`,
        },
      }
    );
    return props;
  }, [formProps]);

  return (
    <Fragment>
      <Button key="button" {...buttonProps} onClick={() => show()}>
        {label}
      </Button>
      <StyledModal
        key="modal"
        destroyOnClose
        {...modalProps}
        {...internalModalProps}
      >
        <ProForm {...customFormProps} {...internalFormProps} submitter={false}>
          {children}
        </ProForm>
      </StyledModal>
    </Fragment>
  );
};

export const StyledModal = styled(Modal)`
  &.ant-modal {
    display: flex;
    flex-direction: column;
    top: 50px;
    max-height: calc(100vh - 100px);
    padding: 0;

    .ant-modal-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;

      .ant-modal-body {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
`;

export default CreateModalButton;
