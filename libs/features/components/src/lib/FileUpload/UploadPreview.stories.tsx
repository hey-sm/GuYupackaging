import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { UploadPreview } from './UploadPreview';

const Story: ComponentMeta<typeof UploadPreview> = {
  component: UploadPreview,
  title: 'FileUploadPreview',
};
export default Story;

const Template: ComponentStory<typeof UploadPreview> = (args) => (
  <UploadPreview {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  url: '',
  fallbackUrl: '',
};
