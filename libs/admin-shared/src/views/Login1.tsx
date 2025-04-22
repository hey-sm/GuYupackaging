import { Button, Form, Input } from 'antd';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore } from '../auth/auth.store';
import Captcha from '../components/Captcha';
import { SessionCreateRequest, SysMenuTreeResponse } from '../model';

export const Login = () => {
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const getMenus = useAuthStore((state) => state.getMenus);

  const navigate = useNavigate();

  const handleFinish = useCallback(
    async (credentials: SessionCreateRequest) => {
      setLoading(true);
      try {
        const session = await login(credentials);
        if (session) {
          const menus: SysMenuTreeResponse[] = await getMenus();

          const workbench = menus.find((v) => v.path === '/workbench');
          const menu = workbench
            ? workbench
            : menus.find((v) => v.parentId && v.parentId !== '0');
          navigate({ pathname: menu?.path || '/' }, { replace: true });
        }
      } catch (e) {
        //
      } finally {
        setLoading(false);
      }
    },
    [getMenus, login, navigate]
  );

  return (
    <Container>
      <Form layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="账号"
          name="account"
          rules={[{ required: true, message: '请输入账号' }]}
        >
          <Input maxLength={11} placeholder="请输入账号" allowClear />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" allowClear />
        </Form.Item>

        <Captcha />

        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            children="登录"
            block
          />
        </Form.Item>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  width: 500px;
  height: 500px;
  margin: 0 auto;
`;

export default Login;
