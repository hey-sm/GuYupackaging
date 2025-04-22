import { Layout } from 'antd';
import Scrollbars from 'rc-scrollbars';
import { ReactNode } from 'react';
import { useSidebarState } from './useSidebarState';

export type SidebarProps = {
  children?: ReactNode;
};

const { Sider } = Layout;

export const Sidebar = (props: SidebarProps) => {
  const { children } = props;

  const [open, setOpen] = useSidebarState();
  const toggleSidebar = (collapsed: boolean) => setOpen(collapsed);

  return (
    <Sider
      className="sidebar"
      width={DRAWER_WIDTH}
      collapsedWidth={CLOSED_DRAWER_WIDTH}
      collapsed={open}
      onCollapse={toggleSidebar}
    >
      <Scrollbars autoHide>{children}</Scrollbars>
    </Sider>
  );
};

export const DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 55;
