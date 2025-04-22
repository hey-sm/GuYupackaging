import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { FilePondListItemAction } from './FilePondListItemAction';
import Uploady from '@rpldy/uploady';

const Story: ComponentMeta<typeof FilePondListItemAction> = {
  component: FilePondListItemAction,
  title: 'FilePondListItemAction',
};
export default Story;

const Template: ComponentStory<typeof FilePondListItemAction> = (args) => (
  <Uploady>
    <FilePondListItemAction {...args} />
  </Uploady>
);

export const Primary = Template.bind({});
Primary.args = {
  id: '',
};
