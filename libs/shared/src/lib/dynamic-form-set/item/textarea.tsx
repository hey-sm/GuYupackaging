import { Col, Form, FormItemProps, Input } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React from 'react';

interface IProps extends FormPropsBase, FormItemProps {}

const FormItemText: React.FC<IProps> = ({
  field,
  noWrapper,
  name,
  layoutGrid = 3,
  ...props
}) => {
  const properties = React.useMemo(
    () => ({
      ...field,
      placeholder: field.placeholder || `请输入${field.columnComment}`,
      minRows: field.minRows || 2,
      maxRows: field.maxRows || 4,
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
        message: `请输入${properties.columnComment}`,
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
        <Input.TextArea
          placeholder={properties.placeholder}
          maxLength={properties.maxLength}
          allowClear={properties.allowClear}
          autoSize={{
            minRows: properties.minRows,
            maxRows: properties.maxRows,
          }}
          showCount={properties.showCount}
          disabled={properties.readOnly}
          style={{ width: `${properties.compentWidth}%` }}
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
      <Input.TextArea
        placeholder={properties.placeholder}
        maxLength={properties.maxLength}
        allowClear={properties.allowClear}
        autoSize={{ minRows: properties.minRows, maxRows: properties.maxRows }}
        showCount={properties.showCount}
        disabled={properties.readOnly}
        style={{ width: `${properties.compentWidth}%` }}
      />
    </Form.Item>
  );
};

export default FormItemText;
