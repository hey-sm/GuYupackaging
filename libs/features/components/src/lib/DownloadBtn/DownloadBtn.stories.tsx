import type { ComponentStory, ComponentMeta } from '@storybook/react';
import DownloadBtn from './DownloadBtn';

const Story: ComponentMeta<typeof DownloadBtn> = {
  component: DownloadBtn,
  title: 'DownloadBtn',
};
export default Story;

const Template: ComponentStory<typeof DownloadBtn> = (args) => (
  <DownloadBtn {...args}>下载</DownloadBtn>
);

export const Primary = Template.bind({});
Primary.args = {};
