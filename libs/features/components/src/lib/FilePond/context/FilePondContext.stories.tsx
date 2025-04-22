import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondProvider } from './FilePondContext';

const Story: ComponentMeta<typeof FilePondProvider> = {
  component: FilePondProvider,
  title: 'FilePondProvider',
};
export default Story;

const Template: ComponentStory<typeof FilePondProvider> = (args) => (
  <FilePondProvider {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
