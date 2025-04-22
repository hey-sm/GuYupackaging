import { Select, InputNumber, Input } from 'antd';
import { useDict } from '../../hooks';
import { DateRangePicker } from '../form-components';
import { ValueEditorProps } from './types';

const ValueEditor = ({ field, value, onChange }: ValueEditorProps) => {
  const dict = useDict(field.dataSource ?? '', {
    query: {
      enabled: !!field.dataSource,
    },
  });

  if (field.dataSource) {
    return (
      <Select
        value={value}
        onChange={onChange}
        placeholder={field.columnComment}
        options={dict.options}
      />
    );
  }

  switch (field.columnType) {
    case 'number':
      return (
        <InputNumber
          value={value}
          onChange={onChange}
          placeholder={field.columnComment}
        />
      );
    case 'date':
      return (
        <DateRangePicker
          value={value}
          onChange={onChange}
          placeholder={field.columnComment}
        />
      );
    case 'datetime':
      return (
        <DateRangePicker
          value={value}
          onChange={onChange}
          placeholder={field.columnComment}
          showTime
        />
      );
    default:
      return (
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={field.columnComment}
        />
      );
  }
};

export default ValueEditor;
