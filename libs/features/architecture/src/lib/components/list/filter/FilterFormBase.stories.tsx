import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilterFormBase } from './FilterFormBase';

const Story: ComponentMeta<typeof FilterFormBase> = {
  component: FilterFormBase,
  title: 'FilterFormBase',
};
export default Story;

const Template: ComponentStory<typeof FilterFormBase> = (args) => (
  <FilterFormBase {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
