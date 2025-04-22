import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ListContextProvider } from './ListContext';

const Story: ComponentMeta<typeof ListContextProvider> = {
  component: ListContextProvider,
  title: 'ListContextProvider',
};
export default Story;

const Template: ComponentStory<typeof ListContextProvider> = (args) => (
  <ListContextProvider {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
