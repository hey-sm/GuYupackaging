import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { message } from 'antd';
import React from 'react';

interface IProps extends SelectProps {
  onChange?: (value: any) => void;
  maxCount?: number;
  maxTagCount: number;
}

export const MultipleSelect = ({
  onChange,
  maxCount,
  maxTagCount,
  ...rest
}: IProps): React.ReactElement => {
  return (
    <Select
      {...rest}
      mode="multiple"
      optionFilterProp="label"
      maxTagCount={maxTagCount}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      onChange={(value) => {
        if (maxCount && value.length > maxCount) {
          onChange?.(value.slice(0, maxCount));
          return message.error(`最多选择${maxCount}个标签`);
        } else {
          onChange?.(value);
        }
      }}
    />
  );
};

export default MultipleSelect;
