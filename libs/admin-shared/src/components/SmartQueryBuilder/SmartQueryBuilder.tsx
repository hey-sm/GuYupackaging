import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Space } from 'antd';
import { useState } from 'react';
import QueryBuilder from './QueryBuilder';
import { QueryBuilderModalProps, SmartQueryBuilderProps } from './types';

// TODO 重构inline模式
export const SmartQueryBuilder = ({
  modal = false,
  fields,
  onSearch,
}: SmartQueryBuilderProps) => {
  const [form] = Form.useForm();
  if (modal) {
    return (
      <QueryBuilderModal form={form} fields={fields} onSearch={onSearch} />
    );
  }
  return <QueryBuilder form={form} fields={fields} />;
};

export const QueryBuilderModal = ({
  form,
  fields,
  onSearch,
}: QueryBuilderModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="primary"
        icon={<SearchOutlined />}
        onClick={() => setOpen(true)}
      >
        查询
      </Button>
      <Modal
        title="条件查询"
        open={open}
        onCancel={() => setOpen(false)}
        width="70%"
        destroyOnClose
        footer={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                form.validateFields().then((values) => {
                  onSearch?.(values);
                  setOpen(false);
                });
              }}
            >
              查询
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        }
      >
        <QueryBuilder form={form} fields={fields} />
      </Modal>
    </>
  );
};

export default SmartQueryBuilder;
