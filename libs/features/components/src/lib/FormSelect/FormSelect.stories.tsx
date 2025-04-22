import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormSelect } from './FormSelect';

const Story: ComponentMeta<typeof FormSelect> = {
  component: FormSelect,
  title: 'FormSelect',
};
export default Story;

const Template: ComponentStory<typeof FormSelect> = (args) => (
  <FormSelect {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
