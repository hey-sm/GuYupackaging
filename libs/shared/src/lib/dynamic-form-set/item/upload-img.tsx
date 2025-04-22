import { Col, Form, FormItemProps } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React from 'react';
import ImageUpload from '../upload-img';

export declare type ResourceFile = {
  /** 资源id */
  uid: string;
  /** 资源地址 */
  url: string;
  /** 名称 */
  name: string;
};
interface IProps extends FormPropsBase, FormItemProps {
  headers?: { [key: string]: any };
  action?: string;
  onChange?: (v: Array<ResourceFile>) => void;
}

const FormItemInput: React.FC<IProps> = ({
  action,
  headers,
  field,
  noWrapper,
  name,
  layoutGrid = 3,
  onChange,
  ...props
}) => {
  const properties = React.useMemo(
    () => ({
      ...field,
      maxLength: field.maxLength || 5,
      fileMaxSize: field.fileMaxSize || 2,
    }),
    [field]
  );

  const columnNumber = React.useMemo(() => 24 / layoutGrid, [layoutGrid]);

  /** 合并正则 */
  const rules = React.useMemo(() => {
    const list: Rule[] = [];
    if (properties.required) {
      list.push({ required: true });
    }
    if (properties.regexs && properties.regexs.length > 0) {
      const regexs: Rule[] = properties.regexs.map((v: any) => ({
        pattern: new RegExp(v.rule),
        message: v.message,
      }));
      list.push(...regexs);
    }
    return [...list, ...(props.rules || [])];
  }, [properties.required, properties.regexs, props.rules]);

  return !noWrapper ? (
    <Col
      span={(properties.formColumn || 1) * columnNumber}
      style={{ display: props.hidden ? 'none' : '' }}
    >
      <Form.Item
        name={name}
        label={properties.columnComment}
        rules={rules}
        initialValue={properties.defaultValue}
      >
        <ImageUpload
          placeholder={properties.placeholder}
          action={action}
          headers={headers}
          maxNumber={properties.maxLength}
        />
      </Form.Item>
    </Col>
  ) : (
    <Form.Item
      {...props}
      name={name}
      rules={rules}
      label={properties.columnComment}
      initialValue={properties.defaultValue}
      noStyle
    >
      <ImageUpload
        placeholder={properties.placeholder}
        action={action}
        headers={headers}
        maxNumber={properties.maxLength}
      />
    </Form.Item>
  );
};

export default FormItemInput;
