import { Col, Form, FormItemProps, Select } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface IProps extends FormPropsBase, FormItemProps {
  fetchData?: (code: string) => Promise<any[]>;
}

const FormItemSelect: React.FC<IProps> = ({
  field,
  noWrapper,
  name,
  layoutGrid = 3,
  fetchData,
  ...props
}) => {
  const properties = useMemo(
    () => ({
      ...field,
      placeholder: field.placeholder || `请选择${field.columnComment}`,
    }),
    [field]
  );
  const columnNumber = useMemo(() => 24 / layoutGrid, [layoutGrid]);
  const [list, setList] = useState<any[]>([]);

  /** 加载数据字典 */
  const loadDictList = useCallback(
    async (code: string) => {
      const data = (await fetchData?.(code)) || [];
      setList(data);
    },
    [fetchData]
  );

  useEffect(() => {
    if (properties.dataSource) loadDictList(properties.dataSource);
  }, [loadDictList, properties.dataSource]);

  /** 合并正则 */
  const rules = useMemo(() => {
    const list: Rule[] = [];
    if (properties.required) {
      list.push({
        required: true,
        message: `请选择${properties.columnComment}`,
      });
    }
    if (properties.maxLength && properties.maxLength > 0) {
      list.push({
        type: 'array',
        max: properties.maxLength,
        message: `最多选择${properties.maxLength}条`,
      });
    }
    if (properties.regexs && properties.regexs.length > 0) {
      const regexs: Rule[] = properties.regexs.map((v: any) => ({
        pattern: new RegExp(v.rule),
        message: v.message,
      }));
      list.push(...regexs);
    }
    return [...list, ...(props.rules || [])];
  }, [
    properties.columnComment,
    properties.required,
    properties.regexs,
    properties.maxLength,
    props.rules,
  ]);

  /** 默认值 */
  const defaultValue = useMemo<string | string[]>(() => {
    if (!properties.defaultValue) return properties.defaultValue;
    return properties.multiple
      ? (properties.defaultValue as string).split(',')
      : properties.defaultValue;
  }, [properties.defaultValue, properties.multiple]);

  return !noWrapper ? (
    <Col
      span={(properties.formColumn || 1) * columnNumber}
      style={{ display: props.hidden ? 'none' : '' }}
    >
      <Form.Item
        {...props}
        name={name}
        label={properties.columnComment}
        initialValue={defaultValue}
        rules={rules}
      >
        <Select
          options={list}
          placeholder={properties.placeholder}
          allowClear={properties.allowClear}
          showSearch={!properties.multiple && properties.showSearch}
          mode={properties.multiple ? 'multiple' : undefined}
          disabled={properties.readOnly}
          style={{ width: `${properties.compentWidth}%` }}
        />
      </Form.Item>
    </Col>
  ) : (
    <Form.Item
      {...props}
      name={name}
      initialValue={defaultValue}
      rules={rules}
      style={{ margin: 0 }}
    >
      <Select
        options={list}
        placeholder={properties.placeholder}
        allowClear={properties.allowClear}
        showSearch={!properties.multiple && properties.showSearch}
        mode={properties.multiple ? 'multiple' : undefined}
        disabled={properties.readOnly}
        style={{ width: `${properties.compentWidth}%` }}
      />
    </Form.Item>
  );
};

export default FormItemSelect;
