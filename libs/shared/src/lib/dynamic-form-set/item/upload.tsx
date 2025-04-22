import { Col, Form, FormItemProps } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React from 'react';
import FileUpload from '../upload-file';

export declare type ResourceFile = {
  /** 资源id */
  resourceId: string;
  /** 资源地址 */
  fileUrl: string;
};

interface IProps extends FormPropsBase, FormItemProps {
  headers?: { [key: string]: any };
  action?: string;
  onChange?: (v: Array<ResourceFile>) => void;
}

const FormItemInput: React.FC<IProps> = ({
  action,
  field,
  noWrapper,
  name,
  headers,
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
        {...props}
        name={name}
        label={properties.columnComment}
        initialValue={properties.defaultValue}
        rules={rules}
      >
        <FileUpload
          placeholder={properties.placeholder}
          maxNumber={properties.maxLength}
        />
        {/* <Upload
          action={action}
          headers={headers}
          beforeUpload={handleBeforeUpload}
          onChange={handleUploadChange}
          multiple={properties.maxLength > 1}
          disabled={properties.readOnly}
          //   name="avatar"
          listType="text"
          className="avatar-uploader"
          fileList={imgFiles}
        >
          {imgFiles.length < properties.maxLength && uploadButtons}
        </Upload> */}
      </Form.Item>
    </Col>
  ) : (
    <Form.Item
      {...props}
      name={name}
      label={properties.columnComment}
      initialValue={properties.defaultValue}
      rules={rules}
      noStyle
    >
      <FileUpload
        placeholder={properties.placeholder}
        maxNumber={properties.maxLength}
      />

      {/* <Upload
        action={action}
        headers={headers}
        beforeUpload={handleBeforeUpload}
        onChange={handleUploadChange}
        multiple={properties.maxLength > 1}
        disabled={properties.readOnly}
        // name="avatar"
        listType="text"
        className="avatar-uploader"
        fileList={imgFiles}
      >
        {imgFiles.length < properties.maxLength && uploadButtons}
      </Upload> */}
    </Form.Item>
  );
};

export default FormItemInput;
