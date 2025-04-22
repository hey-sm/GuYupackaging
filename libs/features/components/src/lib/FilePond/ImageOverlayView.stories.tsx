import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImageOverlayView } from './ImageOverlayView';

const Story: ComponentMeta<typeof ImageOverlayView> = {
  component: ImageOverlayView,
  title: 'ImageOverlayView',
};
export default Story;

const Template: ComponentStory<typeof ImageOverlayView> = (args) => (
  <ImageOverlayView {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  id: '',
};
