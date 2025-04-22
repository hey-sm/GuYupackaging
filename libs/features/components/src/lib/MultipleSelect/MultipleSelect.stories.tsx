import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { MultipleSelect } from './MultipleSelect';

const Story: ComponentMeta<typeof MultipleSelect> = {
  component: MultipleSelect,
  title: 'MultipleSelect',
};
export default Story;

const Template: ComponentStory<typeof MultipleSelect> = (args) => (
  <MultipleSelect {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
