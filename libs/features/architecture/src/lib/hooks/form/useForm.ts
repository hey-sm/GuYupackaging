import {
  ProForm,
  ProFormInstance,
  ProFormProps,
} from '@ant-design/pro-components';
import {
  QueryObserverResult,
  UseMutationResult,
  UseQueryOptions,
} from '@tanstack/react-query';
import { ButtonProps, message } from 'antd';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  CreateParams,
  FormAction,
  GetOneResult,
  RaRecord,
  UpdateParams,
} from '../../types';
import { useCreate, UseCreateOptions } from '../data/useCreate';
import { useGetOne } from '../data/useGetOne';
import { useUpdate, UseUpdateOptions } from '../data/useUpdate';

export type ActionParams = {
  action?: FormAction;
};

export type UseFormProps<
  RecordType extends RaRecord = RaRecord,
  TVariables = any
> = {
  resource?: string;
  id?: string;
  submitOnEnter?: boolean;
  initialFormValues?: any | (() => Promise<any>);
  queryOptions?: UseQueryOptions<RecordType>;
  createMutationOptions?: UseCreateOptions<RecordType>;
  updateMutationOptions?: UseUpdateOptions<RecordType>;
  onMutationSuccess?: (
    data: RecordType,
    variables: TVariables,
    context: any
  ) => void;
  onMutationError?: (
    error: unknown,
    variables: TVariables,
    context: any
  ) => void;
} & ActionParams;

export type UseFormReturnType<
  RecordType extends RaRecord = RaRecord,
  TVariables = any
> = {
  id?: string;
  setId: Dispatch<SetStateAction<string | undefined>>;
  queryResult?: QueryObserverResult<GetOneResult<RecordType>>;
  mutationResult:
    | UseMutationResult<
        RecordType,
        unknown,
        Partial<UpdateParams<RecordType> & { resource?: string }>,
        unknown
      >
    | UseMutationResult<
        RecordType,
        unknown,
        Partial<CreateParams & { resource?: string }>,
        unknown
      >;
  form: ProFormInstance<TVariables>;
  formProps: ProFormProps<TVariables>;
  formLoading: boolean;
  defaultFormValuesLoading: boolean;
  formValues: any;
  initialValues: any;
  formResult: undefined;
  submit: (values?: TVariables) => Promise<RecordType>;
  saveButtonProps: ButtonProps & {
    onClick: () => void;
  };
  onFinish: (values: TVariables) => Promise<RecordType | void>;
};

export const useForm = <
  RecordType extends RaRecord = RaRecord,
  TVariables = any
>({
  resource,
  action: actionFromProps,
  id: idProp,
  queryOptions,
  createMutationOptions,
  updateMutationOptions,
  submitOnEnter = false,
  initialFormValues,
  onMutationSuccess,
  onMutationError,
}: UseFormProps<RecordType, TVariables>): UseFormReturnType<
  RecordType,
  TVariables
> => {
  const [form] = ProForm.useForm();

  const [defaultFormValuesLoading, setDefaultFormValuesLoading] =
    useState(false);
  const [initialValues, setInitialValues] = useState<any>({});
  const [formValues, setFormValues] = useState<any>({});
  const [formResult, setFormResult] = useState<any>();

  const [id, setId] = useState<string | undefined>(idProp);

  useEffect(() => {
    form.resetFields();
  }, [form, id]);

  const action = actionFromProps ?? 'create';

  const isCreate = action === 'create';
  const isEdit = action === 'edit';
  const isClone = action === 'clone';

  const enableQuery = id !== undefined && (isEdit || isClone);

  const queryResult = useGetOne<RecordType>(
    resource as string,
    {
      id: id || '',
    },
    {
      enabled: enableQuery,
      ...queryOptions,
      onSuccess(data) {
        queryOptions?.onSuccess?.(data);

        form.setFieldsValue(data);
      },
    }
  );

  const { isFetching: isFetchingQuery } = queryResult;

  const [create, mutationResultCreate] = useCreate<RecordType>(
    resource,
    {},
    createMutationOptions
  );

  const { isLoading: isLoadingCreate } = mutationResultCreate;

  const [update, mutationResultUpdate] = useUpdate<RecordType>(
    resource,
    {},
    updateMutationOptions
  );

  const { isLoading: isLoadingUpdate } = mutationResultUpdate;

  const onFinishCreate = async (values: any) => {
    return new Promise<RecordType | void>((resolve, reject) => {
      return create(
        resource,
        { data: values },
        {
          onSuccess(data, context) {
            // TODO 上下文notify
            // message.success('操作成功');

            onMutationSuccess?.(data, values, context);

            resolve(data);
          },

          onError: (error, _, context) => {
            if (onMutationError) {
              return onMutationError(error, values, context);
            }
            reject();
          },
        }
      );
    });
  };

  const onFinishUpdate = async (values: any) => {
    return new Promise<RecordType | void>((resolve, reject) => {
      return setTimeout(() => {
        update(
          resource,
          {
            id,
            data: values,
          },
          {
            onSuccess(data, context) {
              // TODO 上下文notify
              // message.success('操作成功');
              // console.log(data,'>>>')
              onMutationSuccess?.(data, values, context);

              resolve(data);
            },
            onError(error, context) {
              if (onMutationError) {
                return onMutationError(error, values, context);
              }
              reject();
            },
          }
        );
      });
    });
  };

  const createResult = {
    formLoading: isFetchingQuery || isLoadingCreate,
    mutationResult: mutationResultCreate,
    onFinish: onFinishCreate,
  };

  const editResult = {
    formLoading: isFetchingQuery || isLoadingUpdate,
    mutationResult: mutationResultUpdate,
    onFinish: onFinishUpdate,
  };

  const result = isCreate || isClone ? createResult : editResult;

  const onKeyUp = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (submitOnEnter && event.key === 'Enter') {
      form.submit();
    }
  };

  useEffect(() => {
    if (idProp !== id) {
      setId(idProp);
    }
  }, [id, idProp]);

  const onFinish = useCallback(
    async (values: TVariables) => {
      setFormValues(values);
      return new Promise<RecordType>((resolve, reject) => {
        form
          .validateFields()
          .then(async (formResult) => {
            setFormResult(formResult);
            const data = await result.onFinish(values);
            if (data) {
              resolve(data);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    [form, result]
  );

  useEffect(() => {
    let isUnMounted = false;

    if (!initialFormValues) {
      return;
    }

    let value: any;

    if (typeof initialFormValues === 'function') {
      setDefaultFormValuesLoading(true);
      value = initialFormValues();
    } else {
      value = initialFormValues;
    }

    Promise.resolve(value)
      .then((data) => {
        if (!isUnMounted) {
          const obj = { ...data };
          Object.keys(data).forEach((name) => {
            obj[name] = form.isFieldTouched(name)
              ? form.getFieldValue(name)
              : data[name];
          });
          setDefaultFormValuesLoading(false);
          setInitialValues(data);
          form.setFieldsValue(obj);
        }
      })
      .catch(() => {
        if (!isUnMounted) {
          setDefaultFormValuesLoading(false);
        }
      });

    return () => {
      isUnMounted = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveButtonProps = {
    disabled: result.formLoading,
    onClick: () => {
      form.submit();
    },
  };

  const formProps = {
    form,
    onFinish,
    initialValues,
  };

  const submit = () => {
    return onFinish(form.getFieldsValue(true));
  };

  return {
    form,
    formProps: {
      ...formProps,
      onFinish: (values: TVariables) =>
        onFinish(values).catch((error) => error),
      onKeyUp,
      initialValues: queryResult?.data,
    },
    defaultFormValuesLoading,
    formValues,
    initialValues,
    formResult,
    formLoading: result.formLoading,
    saveButtonProps,
    mutationResult: result.mutationResult,
    id,
    setId,
    submit,
    onFinish: (values?: TVariables) =>
      onFinish(values ?? form.getFieldsValue(true)),
  };
};
