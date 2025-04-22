import {
  Layout as AntdLayout,
  Menu as DefaultMenu,
  MenuProps,
  SiderProps,
} from 'antd';
import { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';
import { AppBar as DefaultAppBar, AppBarProps } from './AppBar';
import { Sidebar as DefaultSidebar } from './Sidebar';

const { Content } = AntdLayout;

export type LayoutProps = {
  appBar?: ComponentType<AppBarProps>;
  children?: ReactNode;
  className?: string;
  menu?: ComponentType<MenuProps>;
  sidebar?: ComponentType<SiderProps>;
};

export const Layout = (props: LayoutProps) => {
  const {
    appBar: AppBar = DefaultAppBar,
    children,
    className,
    menu: Menu = DefaultMenu,
    sidebar: Sidebar = DefaultSidebar,
  } = props;

  return (
    <StyledLayout className={className}>
      <AppBar />
      <AntdLayout>
        <Sidebar>
          <Menu />
        </Sidebar>
        <AntdLayout>
          <Content>{children}</Content>
        </AntdLayout>
      </AntdLayout>
    </StyledLayout>
  );
};

const StyledLayout = styled(AntdLayout)`
  height: 100vh;

  .ant-layout {
    background-color: #f7f8fa;
  }
`;

export default Layout;
