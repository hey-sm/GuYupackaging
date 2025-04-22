import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { message } from './download';

const Story: ComponentMeta<typeof message> = {
  component: message,
  title: 'message',
};
export default Story;

const Template: ComponentStory<typeof message> = (args) => (
  <message {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
