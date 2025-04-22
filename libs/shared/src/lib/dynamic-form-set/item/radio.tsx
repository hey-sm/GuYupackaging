import { Col, Form, FormItemProps, Radio } from 'antd';
import { Rule } from 'rc-field-form/lib/interface';
import React from 'react';

interface IProps extends FormPropsBase, FormItemProps {
  fetchData?: (code: string) => Promise<g.Dict[]>;
}

const FormItemSelect: React.FC<IProps> = ({
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
  const [list, setList] = React.useState<Array<g.Dict>>([]);

  React.useEffect(() => {
    if (properties.defaultValue && properties.dataSource)
      loadDictList(properties.dataSource);
  }, [properties.dataSource]);

  /** 加载数据字典 */
  const loadDictList = React.useCallback(async (code: string) => {
    const data = (await fetchData?.(code)) || [];
    setList(data);
  }, []);

  /** 合并正则 */
  const rules = React.useMemo(() => {
    const list: Rule[] = [];
    if (properties.required) {
      list.push({ required: true });
    }
    if (properties.maxLength && properties.maxLength > 0) {
      list.push({ type: 'array', max: properties.maxLength });
    }
    if (properties.regexs && properties.regexs.length > 0) {
      const regexs: Rule[] = properties.regexs.map((v) => ({
        pattern: new RegExp(v.rule),
        message: v.message,
      }));
      list.push(...regexs);
    }
    return [...list, ...(props.rules || [])];
  }, [
    properties.required,
    properties.regexs,
    properties.maxLength,
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
        initialValue={'1'}
        rules={rules}
      >
        <Radio.Group
          defaultValue={properties.defaultValue}
          style={{ width: `${properties.compentWidth}%` }}
          disabled={properties.readOnly}
          options={list}
        />
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
      <Radio.Group
        style={{ width: `${properties.compentWidth}%` }}
        disabled={properties.readOnly}
        options={list}
      />
    </Form.Item>
  );
};

export default FormItemSelect;
