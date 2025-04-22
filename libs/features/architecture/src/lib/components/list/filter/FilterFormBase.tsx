import { ProForm, ProFormProps } from '@ant-design/pro-components';
import { FC, ReactNode } from 'react';
import { ListFilterContextValue } from '../../../controller';

export type FilterFormBaseProps = Omit<ProFormProps, 'children'> &
  Partial<ListFilterContextValue> & {
    className?: string;
    resource?: string;
    filters?: ReactNode[];
  };

export const FilterFormBase: FC<FilterFormBaseProps> = (props) => {
  const { className, filters, ...rest } = props;
  return <ProForm {...rest}>{filters}</ProForm>;
};

export default FilterFormBase;
