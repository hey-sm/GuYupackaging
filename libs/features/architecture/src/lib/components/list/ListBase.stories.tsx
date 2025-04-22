import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ListBase } from './ListBase';

const Story: ComponentMeta<typeof ListBase> = {
  component: ListBase,
  title: 'ListBase',
};
export default Story;

const Template: ComponentStory<typeof ListBase> = (args) => (
  <ListBase {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
