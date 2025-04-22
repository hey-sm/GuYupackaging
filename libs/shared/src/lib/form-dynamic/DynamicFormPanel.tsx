import { Row } from 'antd';
import { Rule } from 'antd/lib/form';
import { NamePath } from 'rc-field-form/lib/interface';
import { createContext, FC, Fragment, useMemo } from 'react';
import { DynamicFormItem } from '../dynamic-form-set/item';

interface DynamicFormPanelProps {
  /** form-item的name前缀 */
  namePrefix?: NamePath;
  /** 字段列表 */
  fields: Array<any>;
  /** 布局栅格 */
  layoutGrid?: number;
  getDictRequest: (
    code: string
  ) => Promise<Array<{ label: string; value: string }>>;
}

export const DynamicFormPanelContext = createContext<DynamicFormPanelProps>(
  {} as any
);

/** 动态表单Panel */
export const DynamicFormPanel: FC<DynamicFormPanelProps> = (props) => {
  const { namePrefix, fields, layoutGrid = 3 } = props;

  const namePath = useMemo(
    () =>
      namePrefix
        ? namePrefix instanceof Array
          ? namePrefix
          : [namePrefix]
        : [],
    [namePrefix]
  );

  /** 需要提交 的字段 */
  return (
    <DynamicFormPanelContext.Provider value={props}>
      <Row gutter={16}>
        {fields.map((v) => {
          // 自定义验证例示：判断字段，添加自定义验证，文档：https://ant.design/components/form-cn/#Rule
          const rules: any[] = [];
          if (v.columnDefine === '字段名') {
            const list: Rule[] = [
              {
                type: 'number',
                min: 0,
                max: 9999,
                message: `${v.columnComment} 必须大于0，小于9999`,
              },
              {
                validator: (_rule, value: any) => {
                  if (value === null) {
                    return Promise.reject(`${v.columnComment} 不能为null`);
                  }
                  return Promise.resolve();
                },
              },
            ];
            rules.push(...list);
          }
          if (v.columnType === 'upload' || v.columnType === 'upload-img') {
            let defaultValue: any = [];
            try {
              defaultValue = JSON.parse(v.defaultValue);
              // eslint-disable-next-line no-empty
            } catch (error) {}

            let columnValue: any = [];
            try {
              columnValue = JSON.parse(v.columnValue);
              // eslint-disable-next-line no-empty
            } catch (error) {}

            return (
              <Fragment key={`main-form-field-${v.columnDefine}`}>
                <DynamicFormItem
                  name={[...namePath, v.columnDefine]}
                  field={{
                    ...v,
                    defaultValue,
                    columnValue,
                  }}
                  rules={rules}
                  layoutGrid={layoutGrid}
                  hidden={v.isHide}
                />
              </Fragment>
            );
          } else {
            return (
              <Fragment key={`main-form-field-${v.columnDefine}`}>
                <DynamicFormItem
                  name={[...namePath, v.columnDefine]}
                  field={v}
                  rules={rules}
                  layoutGrid={layoutGrid}
                  hidden={v.isHide}
                />
              </Fragment>
            );
          }
        })}
      </Row>
    </DynamicFormPanelContext.Provider>
  );
};

export default DynamicFormPanel;
