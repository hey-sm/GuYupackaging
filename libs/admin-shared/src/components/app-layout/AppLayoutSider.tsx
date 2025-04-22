import { Layout, Menu, Skeleton } from 'antd';
import { ItemType, SubMenuType } from 'antd/lib/menu/hooks/useItems';
import { useGetMenus } from 'features/new-architecture';
import { cloneDeep } from 'lodash-es';
import { Scrollbars } from 'rc-scrollbars';
import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { SysMenuTreeResponse } from '../../model';
import AppIcon from '../app-icons';

interface LayoutSiderProps {
  collapsed: boolean;
}

const AppLayoutSider: React.FC<LayoutSiderProps> = ({
  collapsed,
  ...props
}) => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const { isLoading, data: menus = [] } = useGetMenus<SysMenuTreeResponse>();

  const allMenus = useMemo(() => {
    if (!menus) return [];
    const list = menus.filter((v) => v.showPosition !== 'noshow');
    return cloneDeep(list);
  }, [menus]);

  const openKeys = useMemo(() => {
    const path = pathname.split('-')[0];
    const menu = menus.find((v) => v.path?.split('?')[0] === path);
    if (menu) {
      const pathlist: string[] = [];
      let tempPath = '';
      menu.path
        ?.split('/')
        .filter((v) => !!v)
        .forEach((v) => {
          tempPath += '/' + v;
          pathlist.push(decodeURIComponent(tempPath));
        });
      return pathlist;
    }
    return [];
  }, [pathname, menus]);

  const selectKey = useMemo(() => {
    const fullpath = pathname + decodeURIComponent(search);
    const menu = menus.find((v) =>
      v.path?.includes('?url=') ? v.path === fullpath : v.path === pathname
    );
    const pathlist: string[] = [];
    let p = pathname;
    if (menu) {
      const [path, query] = menu.path?.split('?url=') || [];
      p = path + (query ? '?url=' + encodeURIComponent(query) : '');
      let tempPath = '';
      menu.path
        ?.split('/')
        .filter((v) => !!v)
        .forEach((v) => {
          tempPath += '/' + v;
          pathlist.push(decodeURIComponent(tempPath));
        });
    }
    return [p, ...pathlist];
  }, [menus, pathname, search]);

  const buildMenuItem = useCallback(
    (menu: SysMenuTreeResponse): ItemType => {
      const children = allMenus.filter((v) => v.parentId === menu.id);

      const [path, query] = menu.path?.split('?url=') || [];
      const enCodePath =
        path + (query ? '?url=' + encodeURIComponent(query) : '');

      const items = children.map((v) => buildMenuItem(v));

      const item: ItemType = {
        key: enCodePath,
        title: menu.name,
        label: menu.name,
        icon: menu.icon && <AppIcon type={menu.icon} />,
      };

      if (items?.length) {
        (item as SubMenuType).children = items;
      }

      return item;
    },
    [allMenus]
  );

  /** 菜单跳转 */
  const handleClickMenu = useCallback(
    ({ key }: any) => {
      const menu = menus.find(
        (v) => v.path === decodeURIComponent(key) || v.path === key
      );

      if (menu && menu.target && menu.target === '_blank') {
        const a = document.createElement('a');
        a.href = menu.path || '';
        a.target = menu.target;
        a.click();
      } else {
        navigate(key);
      }
    },
    [menus, navigate]
  );

  const items = useMemo(
    () =>
      allMenus
        .filter((v) => v.parentId === '0')
        .map((menu) => buildMenuItem(menu)),
    [allMenus, buildMenuItem]
  );

  return (
    <Layout.Sider
      width={240}
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="dark"
      {...props}
    >
      <Container>
        {/* {isLoading ? (
          <div className="p-4">
            <Skeleton paragraph={{ rows: 12 }} active />
          </div>
        ) : (
          <Scrollbars autoHide>
            <Menu
              mode="inline"
              selectedKeys={selectKey}
              defaultOpenKeys={openKeys}
              onClick={handleClickMenu}
              theme="dark"
              items={items}
            />
          </Scrollbars>
        )} */}
        <Scrollbars autoHide>
          <Menu
            mode="inline"
            selectedKeys={selectKey}
            defaultOpenKeys={openKeys}
            onClick={handleClickMenu}
            theme="dark"
            items={items}
          />
        </Scrollbars>
      </Container>
    </Layout.Sider>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  z-index: 3;

  .ant-menu-dark {
    &.ant-menu {
      color: #fff;
      background: linear-gradient(180deg, #1f2935 0%, #425365 100%);
      .ant-menu-submenu-open {
        .ant-menu-inline.ant-menu-sub {
          background: #161d26;
        }
      }
    }
  }

  .logo {
    position: relative;
    z-index: 1;
    display: flex;
    padding: 16px 20px;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    > img {
      width: 190px;
      height: 40px;
    }
    &.mini > img {
      width: 48px;
    }
  }
`;

export default AppLayoutSider;
