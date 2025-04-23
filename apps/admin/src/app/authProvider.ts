import {
  createAdmin,
  queryOwnSysEmployee,
  listSysMenuTreeButton,
} from '@org/admin-shared';
import { AuthProvider } from '@org/features/architecture';
import { sortBy, uniqBy } from 'lodash-es';
import { auth } from '@org/shared';

export const authProvider: AuthProvider = {
  async login(params) {
    const res = await createAdmin(params);
    auth.setToken(res.data?.sessionInfo);
  },
  async logout(params) {
    //
    auth.clearAppStorage();
  },
  async checkAuth(params) {
    //
  },
  async checkError(error) {
    //
  },
  async getUserIdentity(params) {
    const res = await queryOwnSysEmployee({});
    const data = res.data ?? {};
    return { ...data, fullName: data.name };
  },
  async getMenus() {
    const res = await listSysMenuTreeButton({
      system: 'irtp_boss',
    });
    const routes = sortBy(res?.data || [], (v) => v.sort);
    const routesList = routes.map((v) => ({ ...v })) as any;
    const infoList = [
      { path: '/commodity/productDetails', name: '商品详情' },
      { path: '/order/orderInfo', name: '订单详情' },
      { path: '/logistics/sendInfo', name: '发货详情' },
      { path: '/agreement/detail', name: '合作审核详情' },
    ];
    return [...routesList, ...infoList];
  },
};
