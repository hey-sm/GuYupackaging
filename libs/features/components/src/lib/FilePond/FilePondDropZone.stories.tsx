import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondDropZone } from './FilePondDropZone';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof FilePondDropZone> = {
  component: FilePondDropZone,
  title: 'FilePondDropZone',
};
export default Story;

const Template: ComponentStory<typeof FilePondDropZone> = (args) => (
  <Uploady destination={{ url: 'https://your-upload-url.com' }}>
    <FilePondDropZone {...args} />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {
  className: '',
};
