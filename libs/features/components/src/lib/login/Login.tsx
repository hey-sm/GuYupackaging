import {
  ReloadOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Tooltip, Divider } from 'antd';

import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import F from '../images/f.png';
import G from '../images/g.png';
import LoginBg from '../images/login-bg.png';
import Logo from '../images/logo.png';
import S from '../images/s.png';
import { checkCode, Pwd } from './rules';

export interface Credentials {
  account?: string;
  password?: number;
  remember?: boolean;
  code?: number;
  captchaKey?: string;
}

interface IProps {
  onSubmit?: (credentials: Credentials) => Promise<void>;
  onForgetPassword?: () => void;
  captcha: () => Promise<any>;
  userInfo?: Credentials;
}

export const Login = ({
  onSubmit,
  onForgetPassword,
  captcha,
  userInfo,
}: IProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isRemember, setIsRemember] = useState<boolean>(false);

  useEffect(() => {
    if (userInfo && userInfo.remember) {
      form.setFieldValue('account', userInfo.account);
      form.setFieldValue('password', userInfo.password);
      setIsRemember(userInfo.remember);
    }
  }, [form, userInfo]);

  const handleSubmit = useCallback(
    async (values: Credentials) => {
      setLoading(true);
      try {
        await onSubmit?.({ ...values, remember: isRemember });
      } finally {
        setLoading(false);
      }
    },
    [isRemember, onSubmit]
  );

  const [captchaImage, setCaptchaImage] = useState<string>();
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const refreshCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const res = await captcha();
      if (res) {
        setCaptchaImage(res.base64Img);
        form.setFieldValue('captchaKey', res.captchaKey);
      } else {
        setCaptchaImage(undefined);
      }
    } finally {
      setCaptchaLoading(false);
    }
  }, [captcha, form]);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);
  return (
    <Container>
      <div className="flex bg login">
        <img className="login_logo" src={Logo} alt="" />
        <Form
          form={form}
          className="w-[514px] bg-[#fff] box-border"
          onFinish={handleSubmit}
        >
          <div
            className="text-[#333] text-[32px] mb-5"
            style={{ textAlign: 'center', fontWeight: 700 }}
          >
            <span style={{ color: '#0C70EE' }}>登录</span>工业资源交易平台
          </div>
          <div
            className="text-[#333] text-[16px] font-normal mb-5"
            style={{ textAlign: 'center' }}
          >
            多仓直发 · 厂家直供 · 规格齐全 · 极速交货
          </div>
          <Form.Item
            name="account"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input
              className="h-[50px] mb-2  text-base "
              placeholder="请输入账号"
              prefix={<UserOutlined className="icon" />}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ validator: Pwd, required: true }]}
          >
            <Input.Password
              className="h-[50px] mb-2.5 text-base"
              placeholder="请输入密码"
              prefix={<UnlockOutlined className="icon" />}
            />
          </Form.Item>
          <Form.Item>
            <div className="flex items-center mb-2.5">
              <Form.Item
                rules={[{ validator: checkCode, required: false }]}
                name="code"
                noStyle
              >
                <Input
                  maxLength={4}
                  placeholder="请输入验证码"
                  style={{ height: 50 }}
                />
              </Form.Item>
              <Form.Item noStyle>
                {captchaImage && (
                  <img
                    src={captchaImage}
                    style={{ width: 130, height: 48 }}
                    alt=""
                  />
                )}
              </Form.Item>
              <Form.Item noStyle>
                <Tooltip title="刷新验证码">
                  <Button
                    type="text"
                    loading={captchaLoading}
                    icon={<ReloadOutlined style={{ fontSize: 20 }} />}
                    onClick={refreshCaptcha}
                  />
                </Tooltip>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item name="captchaKey" hidden>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              className="btn mb-[22px] text-lg"
              style={{ height: '50px' }}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
          <Divider>推荐浏览器</Divider>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <img src={G} alt="" />
            <img src={F} alt="" />
            <img src={S} alt="" />
          </div>
          {/* <Form.Item name="remember">
            <div className="flex justify-between pr-4 pl-[47px] box-border text-base">
              <Checkbox
                checked={isRemember}
                onChange={(e) => setIsRemember(!isRemember)}
              >
                <span className="text-base">记住密码</span>{' '}
              </Checkbox>
              <a href="" onClick={onForgetPassword}>
                忘记密码？
              </a>
            </div>
          </Form.Item> */}
        </Form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: #373b51;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Noto Sans SC';
  position: relative;
  .login_logo {
    position: absolute;
    width: 199px;
    height: 70px;
    top: 40px;
    left: 120px;
  }
  .login {
    width: 100vw;
    height: 100vh;
  }
  .bg {
    background: url(${LoginBg}) 0 0 no-repeat;
    background-size: 100% 100%;
  }
  .ant-form {
    height: 665px;
    padding: 80px;
    margin: auto;
  }
  .icon {
    font-size: large;
    /* color: var(--ant-primary-color); */
    color: #3278ff;
  }
  .ant-input {
    font-size: 16px;
  }
  .ant-btn {
    font-size: 18px;
  }
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
  }
  .btn {
    background-color: #3278ff;
  }
`;
export default Login;
