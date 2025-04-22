import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Image } from './Image';

const Story: ComponentMeta<typeof Image> = {
  component: Image,
  title: 'Image',
};
export default Story;

const Template: ComponentStory<typeof Image> = (args) => <Image {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  src: 'https://cdn.pixabay.com/photo/2023/09/04/23/58/woman-8233937_1280.jpg',
  loading: 'lazy',
};
