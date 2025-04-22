import type { Meta } from '@storybook/react';
import { UserMenu } from './UserMenu';

const Story: Meta<typeof UserMenu> = {
  component: UserMenu,
  title: 'UserMenu',
};
export default Story;

export const Primary = {
  args: {},
};
