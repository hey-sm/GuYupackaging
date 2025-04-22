import { Button, Col, Form, Input, Row, Select } from 'antd';
import styled from 'styled-components';
import { useDict } from '../../hooks';
import ValueEditor from './ValueEditor';
import { QueryBuilderProps } from './types';

export const QueryBuilder = ({ form, fields }: QueryBuilderProps) => {
  const operations = useDict('compent_arithmetic');

  return (
    <Container form={form} initialValues={{ sqlConfigs: [] }}>
      <Row gutter={[16, 16]}>
        {fields.map((field, index) => {
          return (
            <Col span={12} key={`${field.columnDefine}${index}`}>
              <Row gutter={8}>
                <Col className="logic">
                  <Form.Item
                    hidden
                    name={['sqlConfigs', index, 'columnDefine']}
                    initialValue={field.columnDefine}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    hidden
                    name={['sqlConfigs', index, 'columnComment']}
                    initialValue={field.columnComment}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    hidden
                    name={['sqlConfigs', index, 'columnType']}
                    initialValue={field.columnType}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    hidden
                    name={['sqlConfigs', index, 'dataSource']}
                    initialValue={field.dataSource}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={['sqlConfigs', index, 'logic']}
                    initialValue={field.logic || 'and'}
                    hidden={index === 0}
                  >
                    <Select
                      options={[
                        { label: '并且', value: 'and' },
                        { label: '或者', value: 'or' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col className="columnComment">
                  <Button type="dashed" block>
                    {field.columnComment}
                  </Button>
                </Col>
                <Col className="conditions">
                  <Form.Item
                    name={['sqlConfigs', index, 'conditions']}
                    initialValue={field.conditions || '='}
                  >
                    <Select
                      options={operations.options}
                      placeholder="匹配条件"
                    />
                  </Form.Item>
                </Col>
                <Col flex="1">
                  <Form.Item name={['sqlConfigs', index, 'defaultValue']}>
                    <ValueEditor field={field} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

const Container = styled(Form)`
  .ant-form-item {
    margin-bottom: 0;
  }

  .logic {
    width: 80px;
  }

  .columnComment {
    width: 120px;
  }

  .conditions {
    width: 90px;
  }
`;

export default QueryBuilder;
