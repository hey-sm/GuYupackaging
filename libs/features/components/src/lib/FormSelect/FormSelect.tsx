import type { SelectProps, FormInstance } from 'antd';
import { Form, Select } from 'antd';
import { message } from 'antd';
import type { FormItemProps } from 'antd/lib/form/FormItem';
import { cloneDeep } from 'lodash-es';
import React from 'react';
import styled from 'styled-components';

interface FormHandle extends Omit<FormItemProps, 'name'> {
  name: string;
  rules?: Array<any>;
}

interface IProps extends SelectProps {
  formHandle: FormHandle;
  form: FormInstance;
  maxCount?: number;
}

export const FormSelect = ({
  formHandle,
  form,
  maxCount,
  ...rest
}: IProps): React.ReactElement => {
  const validateCount = (rule: any, values: any) => {
    if (!values) return Promise.resolve();
    if (maxCount && values.length > maxCount) {
      message.warning(`最多选择${maxCount}个标签`);
      setFields(values);
      return Promise.resolve();
    }
    setFields(values);
    return Promise.resolve();
  };

  const setFields = (values: any) => {
    const files = {} as any;
    const newValues = cloneDeep(values);
    files[formHandle?.name] = newValues.splice(0, maxCount ?? newValues.length);
    form.setFieldsValue(files);
  };

  return (
    <FormItemSelectStyled
      {...formHandle}
      name={formHandle?.name}
      rules={[{ validator: validateCount }].concat(formHandle?.rules ?? [])}
    >
      <Select
        {...rest}
        mode="multiple"
        maxTagCount={1}
        maxTagTextLength={8}
        filterOption={true}
        optionFilterProp={'label'}
      />
    </FormItemSelectStyled>
  );
};

const FormItemSelectStyled = styled(Form.Item)`
  .ant-select-selection-overflow {
    height: 32px;
  }
`;

export default FormSelect;
