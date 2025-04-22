import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Share } from './Share';

const Story: ComponentMeta<typeof Share> = {
  component: Share,
  title: 'Share',
};
export default Story;

const Template: ComponentStory<typeof Share> = (args) => <Share {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  businessType: 'material_content',
};
