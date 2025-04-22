import { ProFormText } from '@ant-design/pro-components';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from 'antd';
import { range } from 'lodash-es';
import { Admin } from './Admin';
import { Table } from './Table';
import { DeleteWithConfirmButton } from './button';
import { CreateModalButton } from './form';
import List from './list/List';

const Story: ComponentMeta<typeof Admin> = {
  component: Admin,
  title: 'Admin',
  parameters: {
    mockData: [
      {
        url: 'http://localhost:4400/posts',
        method: 'GET',
        status: 200,
        response: {
          data: range(100).map((v) => ({ title: `Title ${v}`, id: v })),
          total: 100,
        },
      },
      {
        url: 'http://localhost:4400/posts/1',
        method: 'DELETE',
        status: 200,
        response: {
          data: {
            title: 'First Title',
          },
        },
      },
      {
        url: 'http://localhost:4400/posts',
        method: 'POST',
        status: 200,
        response: {
          data: {
            title: 'First Title',
          },
        },
      },
    ],
  },
};
export default Story;

const Component = () => {
  return (
    <List resource="posts">
      <Table
        actions={[
          <CreateModalButton label="新增">
            <ProFormText name="title" />
          </CreateModalButton>,
        ]}
        bulkActionButtons={[<Button key="delete">批量删除</Button>]}
        columns={[
          { dataIndex: 'id', title: 'ID' },
          {
            dataIndex: 'title',
            title: 'Name',
            width: 150,
          },

          {
            dataIndex: 'option',
            title: 'Action',
            width: 150,
            fixed: 'right',
            align: 'center',
            render(value, record, index) {
              return <DeleteWithConfirmButton record={{ id: '1' }} />;
            },
          },
        ]}
      />
    </List>
  );
};

const Template: ComponentStory<typeof Admin> = (args) => {
  return <Component />;
};

export const Primary = Template.bind({});
Primary.args = {};
