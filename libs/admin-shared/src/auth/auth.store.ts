import { message } from 'antd';
import { sortBy } from 'lodash-es';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  createAdmin,
  listSysMenuTreeButton,
  queryOwnSysEmployee,
} from '../endpoints';
import { SysEmployeeResponse, SysMenuTreeResponse } from '../model';

export const useSessionStore = create(
  persist<{ session?: string; setSession: (session?: string) => void }>(
    (set) => ({
      session: undefined,
      setSession(session) {
        set({ session });
      },
    }),
    {
      name: 'token',
    }
  )
);

export const useAuthStore = create(
  immer<{
    loading: boolean;
    userInfo?: SysEmployeeResponse;
    menus: SysMenuTreeResponse[];
    infoList?: any;
    login: (credentials: any) => Promise<string | null>;
    logout: () => void;
    getMenus: () => Promise<SysMenuTreeResponse[]>;
    getUser: () => Promise<void>;
    setINfoList: (value: any) => void;
  }>((set, get) => ({
    loading: false,
    menus: [],
    infoList: [],
    classify: [],
    setINfoList: (data: any) => {
      const infoList: any = get().infoList;
      const index = infoList.findIndex(
        (item: any) => item?.path === data?.path
      );
      if (index !== -1) {
        const list = infoList.map((t: any) => {
          return t.path === data.path ? data : t;
        });
        set({ infoList: list });
      } else {
        infoList.push(data);
        set({ infoList: infoList });
      }
    },
    login: async (credentials) => {
      const res = await createAdmin(credentials);
      if (res?.code === '200' && res?.data?.sessionInfo) {
        if (credentials.remember) {
          set({ userInfo: credentials });
        } else {
          set({ userInfo: undefined });
        }
        const session = res.data?.sessionInfo;
        useSessionStore.getState().setSession(session);
        return session;
      } else {
        message.error(res?.message);
      }
      return null;
    },
    logout: () => {
      // if(userInfo.remember)
      set({ userInfo: undefined, menus: [] });
      useSessionStore.getState().setSession(undefined);
    },
    getMenus: async () => {
      let menus: SysMenuTreeResponse[] = get().menus;

      if (menus.length) return menus;

      const res = await listSysMenuTreeButton({
        system: 'irtp_boss',
      });

      if (res.code === '200') {
        menus = sortBy(res.data || [], (v) => v.sort);
        set({ menus });
      }

      return menus;
    },
    getUser: async () => {
      const { getMenus } = get();

      set({ loading: true });

      const res = await queryOwnSysEmployee({});

      if (res.code === '200' && res.data) {
        set({ userInfo: res.data });
        await getMenus();
      }

      set({ loading: false });
    },
  }))
);
