import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Login } from './Login';

const Story: ComponentMeta<typeof Login> = {
  component: Login,
  title: 'Login',
  argTypes: {
    onSubmit: { action: 'onSubmit' },
    onForgetPassword: { action: 'onForgetPassword' },
    // onCaptcha: { action: 'onCaptcha' },
  },
};

export default Story;
export interface Credentials {
  username?: string;
  password?: number;
  remember?: boolean;
  verifyCode?: number;
}

const Template: ComponentStory<typeof Login> = (args) => <Login {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
