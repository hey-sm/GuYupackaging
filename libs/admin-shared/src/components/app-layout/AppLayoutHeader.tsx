import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  TeamOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { SysMenuTreeResponse } from '@org/admin-shared';
import { Space, Modal, Select } from 'antd';
import {
  AppBar,
  useGetMenus,
  useLogout,
  UserMenu,
} from '@org/features/architecture';
import { cloneDeep } from 'lodash-es';
import { useCallback, useMemo, createElement } from 'react';
import { useNavigate } from 'react-router-dom';
import EditPassword from '../../auth/editPassword';
import UserInfoModal from './userInfo';

export interface AppLayoutHeaderProps {
  collapsed: boolean;
  onChange?: () => void;
  onShowTheme?: () => void;
}

const AppLayoutHeader = ({ collapsed, onChange }: AppLayoutHeaderProps) => {
  const navigate = useNavigate();

  const logoutMutation = useLogout();

  /** 退出登录 */
  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: '退出登录',
      content: '是否确认退出登录？',
      onOk: () => {
        logoutMutation.mutate();
      },
    });
  }, [logoutMutation]);

  const { data: routes = [] } = useGetMenus<SysMenuTreeResponse>();

  const menus = useMemo(
    () => cloneDeep(routes).filter((v) => v.type === 'menu'),
    [routes]
  );
  const menuOptions = useMemo(
    () =>
      menus
        .filter(
          (v) =>
            !menus.some(
              (o) => o.id !== v.id && o.path?.startsWith(v.path || '')
            )
        )
        .map((v) => ({ label: v.name || '', value: v.path || '' })),
    [menus]
  );

  const handleMenuFilter = useCallback(
    (v: string, option: any) => option.label.includes(v),
    []
  );
  const handleMenuChange = useCallback(
    (value: string) => {
      const menu = menus.find(
        (v) => v.path === decodeURIComponent(value) || v.path === value
      );
      if (menu && menu.target && menu.target === '_blank') {
        const a = document.createElement('a');
        a.href = menu.path || '';
        a.target = menu.target;
        a.click();
      } else {
        navigate(value);
      }
    },
    [menus, navigate]
  );

  // 跳转通知列表

  return (
    <AppBar
      userMenu={
        <UserMenu
          menu={{
            items: [
              {
                key: 'userInfo',
                label: (
                  <Space>
                    <TeamOutlined />
                    <UserInfoModal />
                  </Space>
                ),
              },
              {
                key: 'editPassword',
                label: <EditPassword />,
              },
              {
                key: 'logout',
                label: (
                  <Space>
                    <LogoutOutlined />
                    <span className="ml-[2px]">退出登录</span>
                  </Space>
                ),
                onClick: handleLogout,
              },
            ],
          }}
        />
      }
    >
      <div className="header-info">
        <Space>
          {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: onChange,
          })}
          <Select
            options={menuOptions || []}
            filterOption={handleMenuFilter}
            onSelect={handleMenuChange}
            placeholder="快速跳转菜单"
            // bordered={false}
            variant="borderless"
            suffixIcon={<SearchOutlined />}
            showSearch
            allowClear
            size={'middle'}
            // style={{ width: 200 }}
          />
        </Space>
      </div>
    </AppBar>
  );
};

export default AppLayoutHeader;
