import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { Form, Input } from 'antd';
import { CreateModalButton } from './CreateModalButton';

const Story: ComponentMeta<typeof CreateModalButton> = {
  component: CreateModalButton,
  title: 'CreateModalButton',
  parameters: {
    mockData: [
      {
        url: 'http://localhost:4400',
        method: 'POST',
        status: 200,
        response: {
          data: 'Hello storybook-addon-mock!',
        },
      },
    ],
  },
};

export default Story;

const Template: ComponentStory<typeof CreateModalButton> = (args) => (
  <CreateModalButton
    {...args}
    modalProps={{
      title: 'Create Post',
    }}
    formProps={{
      layout: 'vertical',
    }}
    modalFormProps={{
      onMutationSuccess(data, variables, context) {
        console.log(data);
      },
    }}
  >
    <Form.Item label="Title" name="title">
      <Input />
    </Form.Item>
  </CreateModalButton>
);

export const Primary = Template.bind({});
Primary.args = {
  label: '创建',
  resource: 'posts',
};
