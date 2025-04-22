import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondImagePreview } from './FilePondImagePreview';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof FilePondImagePreview> = {
  component: FilePondImagePreview,
  title: 'FilePondImagePreview',
};
export default Story;

const Template: ComponentStory<typeof FilePondImagePreview> = (args) => (
  <Uploady destination={{ url: 'https://your-upload-url.com' }}>
    <FilePondImagePreview {...args} />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {
  id: '',
};
