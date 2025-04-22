import { ProForm, ProFormProps } from '@ant-design/pro-components';
import { Button, ButtonProps, Modal, ModalProps } from 'antd';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { useResourceContext } from '../../context/ResourceContext';
import { useModalForm, UseModalFormProps } from '../../hooks/form/useModalForm';
import { RaRecord } from '../../types';

export type EditModalButtonProps<RecordType extends RaRecord = any> =
  ButtonProps & {
    recordId?: string;
    resource?: string;
    label?: ReactNode;
    record?: any;
    modalProps?: ModalProps;
    formProps?: ProFormProps & { labelWidth?: number };
    modalFormProps?: Omit<UseModalFormProps<RecordType>, 'id' | 'resource'>;
    pageType?: string;
  };

export const EditModalButton = (
  props: PropsWithChildren<EditModalButtonProps>
) => {
  const {
    children,
    recordId,
    label,
    record = {},
    modalProps,
    formProps,
    modalFormProps,
    pageType,
    ...buttonProps
  } = props;

  const [id, setId] = useState<string>();

  const resource = useResourceContext(props);

  const {
    form,
    modalProps: internalModalProps,
    formProps: internalFormProps,
    show,
  } = useModalForm({
    ...modalFormProps,
    id,
    resource,
    initialFormValues: record,
    action: 'edit',
  });

  const onClick = useCallback(() => {
    form.setFieldsValue(record);
    setId(recordId);
    show(recordId);
  }, [form, record, recordId, show]);

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
    <>
      {pageType === 'bannerManage' ? (
        <Button key="button" {...buttonProps} onClick={onClick}>
          {label}
        </Button>
      ) : (
        <a type="link" {...buttonProps} onClick={onClick}>
          {label}
        </a>
      )}

      <StyledModal {...modalProps} {...internalModalProps}>
        <ProForm {...customFormProps} {...internalFormProps} submitter={false}>
          {children}
        </ProForm>
      </StyledModal>
    </>
  );
};

export const StyledModal = styled(Modal)`
  &.ant-modal {
    display: flex;
    flex-direction: column;
    top: 50px;
    /* width: 1200px !important; */
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

export default EditModalButton;
