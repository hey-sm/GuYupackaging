import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileItemProvider } from './FileItemContext';

const Story: ComponentMeta<typeof FileItemProvider> = {
  component: FileItemProvider,
  title: 'FileItemProvider',
};
export default Story;

const Template: ComponentStory<typeof FileItemProvider> = (args) => (
  <FileItemProvider {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
