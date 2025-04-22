import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Download } from './download';

const Story: ComponentMeta<typeof Download> = {
  component: Download,
  title: 'Download',
};
export default Story;

const Template: ComponentStory<typeof Download> = (args: {
  url: string;
  filename: string;
}) => <Download {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
