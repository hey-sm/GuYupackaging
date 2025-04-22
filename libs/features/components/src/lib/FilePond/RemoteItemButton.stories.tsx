import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { RemoteItemButton } from './RemoteItemButton';

const Story: ComponentMeta<typeof RemoteItemButton> = {
  component: RemoteItemButton,
  title: 'RemoteItemButton',
};
export default Story;

const Template: ComponentStory<typeof RemoteItemButton> = (args) => (
  <RemoteItemButton />
);

export const Primary = Template.bind({});
Primary.args = {};
