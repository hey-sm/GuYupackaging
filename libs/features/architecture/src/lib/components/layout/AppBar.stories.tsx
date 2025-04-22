import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { AuthContext } from '../../auth';
import { AppBar } from './AppBar';
import { SidebarToggleButton } from './SidebarToggleButton';

const Story: ComponentMeta<typeof AppBar> = {
  component: AppBar,
  title: 'AppBar',
};

export default Story;

const Template: ComponentStory<typeof AppBar> = (args) => {
  return (
    <AuthContext.Provider
      value={{
        async getUserIdentity(params) {
          return {
            id: '1',
            fullName: 'Story',
          };
        },
      }}
    >
      <AppBar {...args}>
        <SidebarToggleButton />
      </AppBar>
    </AuthContext.Provider>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
