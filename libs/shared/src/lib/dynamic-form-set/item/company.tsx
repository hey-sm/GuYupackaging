import { Col, Form, FormItemProps, TreeSelect } from 'antd';
import { cloneDeep } from 'lodash-es';
import { Rule, FieldData } from 'rc-field-form/lib/interface';
import React, { useCallback, useEffect } from 'react';

interface IProps extends FormPropsBase, FormItemProps {
  fetchData?: () => Promise<any | undefined>;
}

const FormItemCompany: React.FC<IProps> = ({
  field,
  noWrapper,
  name,
  layoutGrid = 3,
  fetchData,
  ...props
}) => {
  const properties = React.useMemo(
    () => ({
      ...field,
      placeholder: field.placeholder || `请选择${field.columnComment}`,
    }),
    [field]
  );
  const columnNumber = React.useMemo(() => 24 / layoutGrid, [layoutGrid]);
  const [list, setList] = React.useState<Array<any[]>>([]);

  const init = useCallback(async () => {
    const data = (await fetchData?.()) || [];
    setList(data);
  }, [fetchData]);

  useEffect(() => {
    init();
  }, [init]);

  /** 合并正则 */
  const rules = React.useMemo(() => {
    const list: Rule[] = [];
    if (properties.required) {
      list.push({ required: true });
    }
    return [...list, ...(props.rules || [])];
  }, [properties.required, props.rules]);

  const displayColumnName = React.useMemo(() => {
    const curName = cloneDeep(name);
    return curName instanceof Array
      ? [...curName.splice(0, curName.length - 1), field.displayColumn || '']
      : field.displayColumn || '';
  }, [field, name]);

  /** 处理显示字段值 */
  const handleSetDisplayName = React.useCallback(
    (value: any, setFields: (fields: FieldData[]) => void) => {
      if (field.displayColumn) {
        const item = list.find((v: any) => v.value === value) as any;
        setFields([{ name: displayColumnName, value: item?.title || '' }]);
      }
    },
    [field, displayColumnName, list]
  );

  return !noWrapper ? (
    <Col
      span={(properties.formColumn || 1) * columnNumber}
      style={{ display: props.hidden ? 'none' : '' }}
    >
      <Form.Item shouldUpdate noStyle>
        {({ setFields }) => (
          <Form.Item
            {...props}
            name={name}
            label={properties.columnComment}
            initialValue={properties.defaultValue}
            rules={rules}
          >
            <TreeSelect
              showSearch
              treeDataSimpleMode
              style={{ width: '100%' }}
              allowClear={properties.allowClear}
              placeholder={properties.placeholder}
              disabled={properties.readOnly}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={list}
              onChange={(v) => handleSetDisplayName(v, setFields)}
            />
          </Form.Item>
        )}
      </Form.Item>
    </Col>
  ) : (
    <Form.Item shouldUpdate noStyle>
      {({ setFields }) => (
        <Form.Item
          {...props}
          name={name}
          label={properties.columnComment}
          rules={rules}
          noStyle
        >
          <TreeSelect
            showSearch
            treeDataSimpleMode
            style={{ width: '100%' }}
            allowClear={properties.allowClear}
            placeholder={properties.placeholder}
            disabled={properties.readOnly}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={list}
            onChange={(v) => handleSetDisplayName(v, setFields)}
          />
        </Form.Item>
      )}
    </Form.Item>
  );
};

export default FormItemCompany;
