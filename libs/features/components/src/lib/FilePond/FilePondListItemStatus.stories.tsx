import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondListItemStatus } from './FilePondListItemStatus';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof FilePondListItemStatus> = {
  component: FilePondListItemStatus,
  title: 'FilePondListItemStatus',
};
export default Story;

const Template: ComponentStory<typeof FilePondListItemStatus> = (args) => (
  <Uploady>
    <FilePondListItemStatus {...args} />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {
  id: '',
};
