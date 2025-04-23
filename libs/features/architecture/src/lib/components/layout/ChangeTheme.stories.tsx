import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { AuthContext } from '../../auth';
import { ChangeTheme } from './ChangeTheme';

const Story: ComponentMeta<typeof ChangeTheme> = {
  component: ChangeTheme,
  title: 'ChangeTheme',
};

export default Story;

const Template: ComponentStory<typeof ChangeTheme> = (args) => {
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
      <ChangeTheme {...args} />
    </AuthContext.Provider>
  );
};

export const Primary = Template.bind({});
Primary.args = {};
