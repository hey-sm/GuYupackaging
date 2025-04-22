import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondListItem } from './FilePondListItem';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof FilePondListItem> = {
  component: FilePondListItem,
  title: 'FilePondListItem',
};
export default Story;

const Template: ComponentStory<typeof FilePondListItem> = (args) => (
  <Uploady>
    <FilePondListItem {...args} />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {};
