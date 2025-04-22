import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ResourceContextProvider } from './ResourceContext';

const Story: ComponentMeta<typeof ResourceContextProvider> = {
  component: ResourceContextProvider,
  title: 'ResourceContextProvider',
};
export default Story;

const Template: ComponentStory<typeof ResourceContextProvider> = (args) => (
  <ResourceContextProvider {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
