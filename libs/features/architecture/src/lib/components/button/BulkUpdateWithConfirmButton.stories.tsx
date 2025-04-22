import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { BulkUpdateWithConfirmButton } from './BulkUpdateWithConfirmButton';

const Story: ComponentMeta<typeof BulkUpdateWithConfirmButton> = {
  component: BulkUpdateWithConfirmButton,
  title: 'BulkUpdateWithConfirmButton',
};
export default Story;

const Template: ComponentStory<typeof BulkUpdateWithConfirmButton> = (args) => (
  <BulkUpdateWithConfirmButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
