import { Select, SelectProps } from 'antd';
import React from 'react';

declare type OmitProps = Omit<Omit<SelectProps<string[]>, 'value'>, 'onChange'>;

interface SelectMultipleProps extends OmitProps {
  value?: string;
  onChange?: (v: string | null) => void;
}

const SelectMultiple: React.FC<SelectMultipleProps> = ({
  value,
  onChange,
  ...props
}) => {
  const arrayValue = React.useMemo(
    () => (value ? value.split(',') : []),
    [value]
  );

  const handleChange = (v: string[]) => {
    const stringValue = v ? v.join(',') : null;
    if (onChange) onChange(stringValue);
  };

  return (
    <Select<string[]>
      {...props}
      value={arrayValue}
      mode="multiple"
      onChange={handleChange}
    />
  );
};

export default SelectMultiple;
