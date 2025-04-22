import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProcessItemButton } from './ProcessItemButton';

const Story: ComponentMeta<typeof ProcessItemButton> = {
  component: ProcessItemButton,
  title: 'ProcessItemButton',
};
export default Story;

const Template: ComponentStory<typeof ProcessItemButton> = (args) => (
  <ProcessItemButton />
);

export const Primary = Template.bind({});
Primary.args = {};
