import { useGetMenus } from '@org/features/architecture';
import { cloneDeep, last } from 'lodash-es';
import { useMemo } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { SysMenuTreeResponse } from '../model';

export const useCurrentMenu = () => {
  const { pathname, search } = useLocation();

  const fullPath = useMemo(
    () => decodeURIComponent(pathname + search),
    [pathname, search]
  );

  const { data: routes = [] } = useGetMenus<SysMenuTreeResponse>();

  const allMenus = useMemo(() => cloneDeep(routes), [routes]);

  const match = last(useMatches());
  const handle: any = match?.handle;

  const currentMenu = useMemo(() => {
    const menu = allMenus.find((v) => {
      if (v.path?.includes('?url=')) {
        return v.path === fullPath;
      }
      if (pathname === '/enterprise/addenterprise') {
        return v.path === '/enterprise/verbList';
      }

      if (handle?.activeMenu) {
        return v.path === handle.activeMenu;
      }

      return v.path === pathname;
    });

    if (menu) {
      return {
        ...menu,
        fullPath,
      };
    }
  }, [allMenus, fullPath, handle?.activeMenu, pathname]);

  return currentMenu;
};
