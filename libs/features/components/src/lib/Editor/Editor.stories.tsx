import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Editor from './Editor';

const Story: ComponentMeta<typeof Editor> = {
  component: Editor,
  title: 'Editor',
};
export default Story;

const Template: ComponentStory<typeof Editor> = (args) => <Editor {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  signature: {
    dir: '11',
    accessid: '11',
    host: '11',
    policy: '11',
    signature: '11',
    expire: '11',
    callback: '11',
  },
};
