import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { DeleteWithConfirmButton } from './DeleteWithConfirmButton';

const Story: ComponentMeta<typeof DeleteWithConfirmButton> = {
  component: DeleteWithConfirmButton,
  title: 'DeleteWithConfirmButton',
};
export default Story;

const Template: ComponentStory<typeof DeleteWithConfirmButton> = (args) => (
  <DeleteWithConfirmButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
