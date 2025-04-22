import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { RecordContextProvider } from './RecordContext';

const Story: ComponentMeta<typeof RecordContextProvider> = {
  component: RecordContextProvider,
  title: 'RecordContextProvider',
};
export default Story;

const Template: ComponentStory<typeof RecordContextProvider> = (args) => (
  <RecordContextProvider {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
