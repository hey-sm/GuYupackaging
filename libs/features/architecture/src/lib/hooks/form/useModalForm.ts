import { ProFormProps } from '@ant-design/pro-components';
import { FormInstance, ModalProps } from 'antd';
import { useCallback, useEffect } from 'react';
import { RaRecord } from '../../types';
import { useModal } from '../modal/useModal';
import { useForm, UseFormProps, UseFormReturnType } from './useForm';

export type useModalFormFromSFReturnType<RecordType, TVariables> = {
  open: boolean;
  form: FormInstance<TVariables>;
  show: (id?: string) => void;
  close: () => void;
  modalProps: ModalProps;
  formProps: ProFormProps<TVariables>;
  formLoading: boolean;
  defaultFormValuesLoading: boolean;
  formValues: Record<string, any>;
  initialValues: Record<string, any>;
  formResult: undefined;
  submit: (values?: TVariables) => Promise<RecordType>;
};

export type UseModalFormProps<
  RecordType extends RaRecord = RaRecord,
  TVariables = any
> = UseFormProps<RecordType, TVariables> & {
  initialVisible?: boolean;
  autoSubmitClose?: boolean;
  autoResetForm?: boolean;
};

export type UseModalFormReturnType<
  RecordType extends RaRecord = RaRecord,
  TVariables = any
> = Omit<
  UseFormReturnType<RecordType, TVariables>,
  'saveButtonProps' | 'deleteButtonProps'
> &
  useModalFormFromSFReturnType<RecordType, TVariables>;

export const useModalForm = <
  RecordType extends RaRecord = RaRecord,
  TVariables = any
>({
  initialVisible,
  autoSubmitClose = true,
  autoResetForm = true,
  ...rest
}: UseModalFormProps<RecordType, TVariables>): UseModalFormReturnType<
  RecordType,
  TVariables
> => {
  const useFormProps = useForm<RecordType, TVariables>({
    ...rest,
  });

  const { form, formProps, setId, formLoading, mutationResult, submit } =
    useFormProps;

  const { open, show, close, modalProps } = useModal({
    initialVisible,
  });

  const modalFormProps = {
    ...modalProps,
    onOk: () => {
      submit().then(() => {
        if (autoSubmitClose) {
          close();
        }

        if (autoResetForm) {
          form.resetFields();
        }
      });
    },
  };

  const {
    isLoading: isLoadingMutation,
    isSuccess: isSuccessMutation,
    reset: resetMutation,
  } = mutationResult ?? {};

  useEffect(() => {
    if (open) {
      if (isSuccessMutation && !isLoadingMutation) {
        close();
        resetMutation?.();
        // Prevents resetting form values before closing modal in UI

        setTimeout(() => {
          form.resetFields();
        });
      }
    }
  }, [isSuccessMutation, isLoadingMutation, close, resetMutation, form, open]);

  const saveButtonPropsSF = {
    disabled: formLoading,
    onClick: () => {
      submit();
    },
    loading: formLoading,
  };

  const handleClose = useCallback(() => {
    form.resetFields();

    setId?.(undefined);
    close();
  }, [close, form, setId]);

  const handleShow = useCallback(
    (id?: string) => {
      setId?.(id);
      show();
    },
    [setId, show]
  );

  return {
    ...useFormProps,
    show: handleShow,
    close: handleClose,
    open,
    formProps: {
      ...useFormProps.formProps,
      onValuesChange: formProps?.onValuesChange,
      onKeyUp: formProps?.onKeyUp,
      onFinish: formProps.onFinish,
    },
    modalProps: {
      ...modalFormProps,
      okButtonProps: saveButtonPropsSF,
      onCancel: handleClose,
      destroyOnClose: true,
    },
    formLoading,
  };
};
