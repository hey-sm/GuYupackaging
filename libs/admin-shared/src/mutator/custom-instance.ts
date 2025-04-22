import { message } from 'antd';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore, useSessionStore } from '../auth/auth.store';

message.config({ maxCount: 1 });
const timeout = 1000 * 60 * 2;
export const AXIOS_INSTANCE = Axios.create({
  // baseURL: 'http://irtp-trade-dev.qimoyun.com',
  baseURL: import.meta.env.VITE_API_BASE_UR,
  timeout,
});

AXIOS_INSTANCE.interceptors.request.use((value) => {
  const session = useSessionStore.getState().session;

  if (value.headers && session) {
    (value.headers as any)['Authorization'] = session;
  }
  return value;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    // TODO 如果code不为200，错误提示
    return response;
  },
  (error) => {
    // 2023年4月18日10:40:43 新增判断token失效，退出重新登录
    if (!(error?.response?.data?.success) && (error?.response?.data?.code) == 'RELOGIN') {
      message.error('登录失效，请重新登录');
      useAuthStore.getState().logout();
      return;
    }
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        message.error('登录失效，请重新登录');
        useAuthStore.getState().logout();
        return;
      }

      if (response.status === 404) {
        message.error('未找到相关页面');
        return Promise.reject({ code: '404', message: '未找到相关页面' });
      }

      let msg =
        response.data?.exceptionMsg ??
        (response.data?.message || '报告！服务器出了点小问题，稍后再试试...');

      if (response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (res) => {
          const { result } = (res.target || {}) as any;
          const jsonRes = JSON.parse(result);
          msg = jsonRes?.message || '报告！服务器出了点小问题，稍后再试试...';
          message.error(msg);
        };
        reader.readAsText(response.data, 'utf-8');
      } else {
        message.error(msg);
      }

      return Promise.reject({ code: '500', message: msg });
    }

    // 请求超时
    if (error.code === 'ECONNABORTED') {
      const msg = '请求超时，请稍后再试';
      message.error(msg);

      return Promise.reject({ code: '500', message: msg });
    }
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject({ code: '500', message: error.message });
    }

    // 默认错误提示
    const msg = '您的网络出现问题，请检查网络重试';
    message.error(msg);

    // eslint-disable-next-line no-console
    console.error(error);
    return Promise.reject({ code: '500', message: msg });
  }
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
    ({ data }) => data
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};

export default customInstance;

export type ErrorType<Error> = AxiosError<Error>;
