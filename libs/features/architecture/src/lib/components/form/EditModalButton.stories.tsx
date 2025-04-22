import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Form, Input } from 'antd';
import { EditModalButton } from './EditModalButton';

const Story: ComponentMeta<typeof EditModalButton> = {
  component: EditModalButton,
  title: 'EditModalButton',
  parameters: {
    mockData: [
      {
        url: 'http://localhost:4400/posts/1',
        method: 'GET',
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

const Template: ComponentStory<typeof EditModalButton> = (args) => (
  <EditModalButton {...args}>
    <Form.Item label="Title" name="title">
      <Input />
    </Form.Item>
  </EditModalButton>
);

export const Primary = Template.bind({});
Primary.args = {
  resource: 'posts',
  recordId: '1',
  label: 'Edit',
  modalProps: {
    title: 'Edit Post',
  },
};
