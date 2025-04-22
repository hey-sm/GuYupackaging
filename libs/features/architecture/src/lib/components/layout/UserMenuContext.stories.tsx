import type { Meta } from '@storybook/react';
import { UserMenuContextProvider } from './UserMenuContext';

const Story: Meta<typeof UserMenuContextProvider> = {
  component: UserMenuContextProvider,
  title: 'UserMenuContextProvider',
};
export default Story;

export const Primary = {
  args: {},
};
