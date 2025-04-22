import { ProFormText } from '@ant-design/pro-components';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilterForm } from './FilterForm';

const Story: ComponentMeta<typeof FilterForm> = {
  component: FilterForm,
  title: 'FilterForm',
};
export default Story;

const Template: ComponentStory<typeof FilterForm> = (args) => (
  <FilterForm {...args}>
    <ProFormText label="会员编码会员编码" name="name" />
    <ProFormText label="用户姓名" name="name1" />
    <ProFormText label="手机号" name="name2" />
    <ProFormText label="用户用户状态" name="name3" />
    <ProFormText label="注册日期" name="name3" />
    <ProFormText label="会员编码会员编码" name="name3" />
  </FilterForm>
);

export const Primary = Template.bind({});
Primary.args = {
  span: 6,
  labelWidth: 140,
  async onFinish(values) {
    console.log(values);
  },
};
