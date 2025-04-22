import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondList } from './FilePondList';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof FilePondList> = {
  component: FilePondList,
  title: 'FilePondList',
};
export default Story;

const Template: ComponentStory<typeof FilePondList> = (args) => (
  <Uploady>
    <FilePondList />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {
  files: [
    {
      url: '	https://cdn.pixabay.com/photo/2023/09/04/23/58/woman-8233937_1280.jpg',
    },
  ],
};
