import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { TagsViewProvider } from './TagsViewContext';

const Story: ComponentMeta<typeof TagsViewProvider> = {
  component: TagsViewProvider,
  title: 'TagsViewProvider',
};
export default Story;

const Template: ComponentStory<typeof TagsViewProvider> = (args) => (
  <TagsViewProvider {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
