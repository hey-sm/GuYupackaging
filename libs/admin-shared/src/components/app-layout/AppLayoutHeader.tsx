import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  TeamOutlined,
  SearchOutlined,
} from '@ant-design/icons';
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
import { useCollapsed, useTheme } from '@org/shared';
import { useTranslation } from 'react-i18next';

const AppLayoutHeader = () => {
  const { collapsed, setCollapsed } = useCollapsed();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const logoutMutation = useLogout();

  /** 退出登录 */
  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: t('header.logout'),
      content: '是否确认退出登录？',
      onOk: () => {
        logoutMutation.mutate();
      },
    });
  }, [logoutMutation]);

  const { data: routes = [] } = useGetMenus<any>();

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
          theme={theme}
          setTheme={setTheme}
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
                    <span className="ml-[2px]">{t('header.logout')}</span>
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
            onClick: () => setCollapsed(!collapsed),
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
