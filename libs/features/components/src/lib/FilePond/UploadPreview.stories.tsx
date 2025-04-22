import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { UploadPreview } from './UploadPreview';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof UploadPreview> = {
  component: UploadPreview,
  title: 'UploadPreview',
  argTypes: {
    onRemove: { action: 'onRemove executed!' },
  },
};
export default Story;

const Template: ComponentStory<typeof UploadPreview> = (args) => (
  <Uploady>
    <UploadPreview {...args} />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {
  fallbackUrl: '',
};
