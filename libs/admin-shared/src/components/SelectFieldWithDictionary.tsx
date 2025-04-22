import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { UseQueryOptions } from '@tanstack/react-query';
import { Form, Input } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { FC, Fragment, useEffect, useMemo } from 'react';
import { useSelectByCodeDic } from '../endpoints';
import { ResultListSysDictResponse } from '../model';

export type Suggestion = {
  name?: string;
  optionLabel?: string; // label
  optionValue?: string; // value
};

export type SelectFieldWithDictionaryProps = Omit<
  ProFormSelectProps,
  'options'
> & {
  name: NamePath;
  code: string;
  queryOptions?: UseQueryOptions<ResultListSysDictResponse>;
  suggestion?: Suggestion | boolean;
};

export const SelectFieldWithDictionary: FC<SelectFieldWithDictionaryProps> = (
  props
) => {
  const { code, queryOptions, name, suggestion = false, ...rest } = props;

  const { data } = useSelectByCodeDic({ code }, { query: queryOptions });

  const options = useMemo(() => {
    if (data?.data) {
      return data.data?.map((v, index) => ({
        label: v.dictName,
        value: v.dictKey,
        key: v.dictKey || index,
      }));
    }
    return [];
  }, [data?.data]);

  const form = Form.useFormInstance();

  const selectValue: string[] | string = Form.useWatch(name, form);

  const suggestionOptions = useMemo(() => {
    return Object.assign(
      {},
      {
        name: `${name}Suggestion`,
        optionLabel: 'label',
        optionValue: 'value',
      },
      typeof suggestion === 'boolean' ? {} : suggestion
    );
  }, [name, suggestion]);

  useEffect(() => {
    if (selectValue && suggestion) {
      form.setFieldValue(
        suggestionOptions.name,
        options
          .filter((v) => Boolean(v.value))
          .filter((v) => selectValue.includes(v.value as string))
          .map((v) => ({
            [suggestionOptions.optionLabel]: v.label,
            [suggestionOptions.optionValue]: v.value,
          }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, selectValue, suggestion]);

  return (
    <Fragment>
      <ProFormSelect {...rest} name={name} options={options} allowClear />
      {!!suggestion && (
        <Form.Item
          hidden
          name={suggestionOptions.name}
          key={suggestionOptions.name}
        >
          <Input />
        </Form.Item>
      )}
    </Fragment>
  );
};

export default SelectFieldWithDictionary;
