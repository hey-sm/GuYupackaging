import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { DownloadPage } from './download';

const Story: ComponentMeta<typeof DownloadPage> = {
  component: DownloadPage,
  title: 'DownloadPage',
};
export default Story;

const Template: ComponentStory<typeof DownloadPage> = (args) => (
  <DownloadPage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
