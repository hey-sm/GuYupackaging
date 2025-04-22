import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Confirm } from './Confirm';

const Story: ComponentMeta<typeof Confirm> = {
  component: Confirm,
  title: 'Confirm',
};
export default Story;

const Template: ComponentStory<typeof Confirm> = (args) => (
  <Confirm {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
