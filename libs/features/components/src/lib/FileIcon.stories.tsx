import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileIcon } from './FileIcon';

const Story: ComponentMeta<typeof FileIcon> = {
  component: FileIcon,
  title: 'FileIcon',
};
export default Story;

const Template: ComponentStory<typeof FileIcon> = (args) => (
  <FileIcon {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
