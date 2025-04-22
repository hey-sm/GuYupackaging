import { FormInstance } from 'antd';
import { DynamicQuerySqlDto } from '../../model';

export interface QueryBuilderField {
  columnType?: string;
  columnDefine: string;
  defaultValue?: any;
  columnComment?: string;
  logic?: 'and' | 'or';
  conditions?: string;
  dataSource?: string;
}

export interface QueryBuilderProps {
  form: FormInstance<any>;
  fields: QueryBuilderField[];
}

export interface SmartQueryBuilderProps {
  modal?: boolean;
  fields: QueryBuilderField[];
  onSearch?: (values: { sqlConfigs: DynamicQuerySqlDto[] }) => void;
}

export interface QueryBuilderModalProps {
  form: FormInstance<any>;
  fields: QueryBuilderField[];
  onSearch?: (values: { sqlConfigs: DynamicQuerySqlDto[] }) => void;
}

export interface ValueEditorProps {
  field: QueryBuilderField;
  value?: any;
  onChange?: (value: any) => void;
}
