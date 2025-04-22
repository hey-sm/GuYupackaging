/*
 * @Author: liaolin
 * @Date: 2023-04-10 11:18:13
 * @LastEditors: liaolin
 * @LastEditTime: 2023-04-12 17:05:48
 * @Description: 请填写简介
 * 仅限内部使用
 */
import { LoginPublic } from '@org/features/components';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuthStore } from '../auth/auth.store';
import { captchaAdmin } from '../endpoints';
import { SysMenuTreeResponse } from '../model';

export const Login = () => {
  const login = useAuthStore((state) => state.login);
  const getMenus = useAuthStore((state) => state.getMenus);

  const navigate = useNavigate();

  const captcha = useCallback(async () => {
    const res = await captchaAdmin();
    if (res?.code === '200') {
      return res?.data;
    } else {
      return undefined;
    }
  }, []);

  const handleFinish = useCallback(
    async (credentials: any) => {
      try {
        // const session = await login(credentials);
        // if (session) {
        //   const menus: SysMenuTreeResponse[] = await getMenus();

        //   const workbench = menus.find((v) => v.path === '/workbench');
        //   const menu = workbench
        //     ? workbench
        //     : menus.find((v) => v.parentId && v.parentId !== '0');
        //   navigate({ pathname: menu?.path || '/' }, { replace: true });
        // }
        navigate({ pathname: '/' }, { replace: true });
      } catch (e) {
        //
      } finally {
        // setLoading(false);
      }
    },
    [getMenus, login, navigate]
  );
  const userInfo = useAuthStore((state) => state.userInfo);
  return (
    <Container>
      <LoginPublic
        userInfo={userInfo ?? {}}
        onSubmit={handleFinish}
        captcha={captcha}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default Login;
