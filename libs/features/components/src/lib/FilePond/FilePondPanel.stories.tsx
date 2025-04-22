import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondPanel } from './FilePondPanel';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof FilePondPanel> = {
  component: FilePondPanel,
  title: 'FilePondPanel',
};
export default Story;

const Template: ComponentStory<typeof FilePondPanel> = (args) => (
  <Uploady>
    <FilePondPanel />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {};
