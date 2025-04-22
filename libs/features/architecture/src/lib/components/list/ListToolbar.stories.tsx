import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ListToolbar } from './ListToolbar';

const Story: ComponentMeta<typeof ListToolbar> = {
  component: ListToolbar,
  title: 'ListToolbar',
};
export default Story;

const Template: ComponentStory<typeof ListToolbar> = (args) => (
  <ListToolbar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
