import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { List } from './List';

const Story: ComponentMeta<typeof List> = {
  component: List,
  title: 'List',
};
export default Story;

const Template: ComponentStory<typeof List> = (args) => <List {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  aside: <div>aside</div>,
};
