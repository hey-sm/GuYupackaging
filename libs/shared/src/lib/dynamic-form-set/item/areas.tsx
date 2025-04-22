import { Col, Form, FormItemProps } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React from 'react';
import { AreaPicker } from '../../form-components';

interface IProps extends FormPropsBase, FormItemProps {
  dataSource?: Array<any>;
}

const FormItemSelect: React.FC<IProps> = ({
  field,
  noWrapper,
  name,
  layoutGrid = 3,
  dataSource,
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

  /** 合并正则 */
  const rules = React.useMemo(() => {
    const list: Rule[] = [];
    if (properties.required) {
      list.push({
        required: true,
        message: `请选择${properties.columnComment}`,
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
    props.rules,
  ]);

  return !noWrapper ? (
    <Col
      span={(properties.formColumn || 1) * columnNumber}
      style={{ display: props.hidden ? 'none' : '' }}
    >
      <Form.Item
        {...props}
        name={name}
        label={properties.columnComment}
        initialValue={properties.defaultValue}
        rules={rules}
      >
        <AreaPicker
          dataSource={dataSource}
          allowClear={properties.allowClear}
          disabled={properties.readOnly}
          style={{ width: `${properties.compentWidth}%` }}
          placeholder={properties.placeholder}
        />
      </Form.Item>
    </Col>
  ) : (
    <Form.Item
      {...props}
      name={name}
      initialValue={properties.defaultValue}
      rules={rules}
      style={{ margin: 0 }}
    >
      <AreaPicker
        dataSource={dataSource}
        allowClear={properties.allowClear}
        disabled={properties.readOnly}
        style={{ width: `${properties.compentWidth}%` }}
        placeholder={properties.placeholder}
      />
    </Form.Item>
  );
};

export default FormItemSelect;
