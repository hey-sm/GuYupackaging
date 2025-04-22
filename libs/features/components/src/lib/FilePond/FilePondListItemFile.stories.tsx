import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondListItemFile } from './FilePondListItemFile';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof FilePondListItemFile> = {
  component: FilePondListItemFile,
  title: 'FilePondListItemFile',
};
export default Story;

const Template: ComponentStory<typeof FilePondListItemFile> = (args) => (
  <Uploady>
    <FilePondListItemFile {...args} />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {
  id: '',
};
