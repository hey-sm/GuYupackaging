import { Layout } from 'antd';
import { useGetIdentity } from '@org/features/architecture';
import { last } from 'lodash-es';
import KeepAlive from 'react-activation';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyle from '../../themes/global.style';
import { useLoadingBar } from 'react-top-loading-bar';

import GlobalSpinner from '../GlobalSpinner';

import AppLayoutHeader from './AppLayoutHeader';
import AppLayoutSider from './AppLayoutSider';
import TagsView from './TagsView';
import { useEffect, useLayoutEffect } from 'react';

export const AppLayout = () => {
  // useEffect(() => {
  //   const layoutListen = listen(LayoutEvent.CHANGE_SIDER, (e) => {
  //     const et = e as CustomEvent<boolean>;
  //     setCollapsed(et.detail);
  //   });

  //   return () => {
  //     layoutListen();
  //   };
  // }, [listen]);

  const { isLoading, data: userInfo } = useGetIdentity();
  const { start, complete, decrease, increase } = useLoadingBar({
    height: 3,
  });
  // const getMenus = useGetMenus();

  // 如果last(matches) handle 的 cache = true 说明要缓存

  const location = useLocation();

  const match = last(useMatches());

  const handle: any = match?.handle;
  console.log(handle?.cache !== false, 'handle');

  // if (isLoading || getMenus.isLoading) {
  //   return <GlobalSpinner size="large" tip="系统资源加载中..." />;
  // }
  useLayoutEffect(() => {
    start();
  }, []);
  useEffect(() => {
    complete();
  }, [location.pathname]);
  return (
    <Container>
      <GlobalStyle />
      <>
        <AppLayoutSider />
        <Layout className="layout-main">
          <AppLayoutHeader />
          <Layout.Content className="layout-main-content">
            <TagsView />

            <KeepAlive
              id={location.pathname + location.search}
              name={location.pathname}
              // when={handle?.cache !== false}
              when={false}
            >
              <Outlet />
            </KeepAlive>
            {/* <Outlet /> */}
          </Layout.Content>
        </Layout>
      </>
    </Container>
  );
};

const Container = styled(Layout)`
  width: 100%;
  height: 100%;

  .ant-descriptions-item-label {
    width: 110px;
    white-space: nowrap;
  }

  .layout-main {
    display: flex;
    flex-direction: column;
  }

  .ant-layout-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    & .ant-tabs-top > .ant-tabs-nav {
      margin: 0;
    }

    .ka-wrapper {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      padding: 20px;

      .ka-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }

    .page-container {
      flex: 1;
      min-height: 0;
      position: relative;
    }
    .ant-card {
      border-radius: 8px;
    }

    .ant-card-small > .ant-card-body {
      padding: 20px;
    }

    .ant-descriptions-bordered.ant-descriptions-small
      .ant-descriptions-item-label {
      padding: 2px 0px;
      text-align: center;
    }

    .ant-descriptions-small .ant-descriptions-row > td {
      padding: 2px 6px;
      & > span {
        display: flex;
        width: 100%;
        min-height: 32px;
        align-items: center;
      }
    }

    .ant-card-body .ant-col {
      padding-right: 3px !important;
      padding-left: 5px !important;
    }
  }
`;

export default AppLayout;
