import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import history from './history';
import config from '@/config';
import storage from '@/utils/storage';

type RequestOptions = AxiosRequestConfig & {
  url: string;
  body?: any;
  headers?: any;
};

message.config({ maxCount: 1 });

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 2023年4月18日10:40:43 新增判断token失效，退出重新登录
    if (!(error?.response?.data?.success) && (error?.response?.data?.code) == 'RELOGIN') {
      message.error('登录失效，请重新登录');
      storage.set(config.authKey, null);
      history.replace('/login');
      return { code: '500', message: '登录失效，请重新登录' };
    }
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        message.error('登录失效，请重新登录');
        storage.set(config.authKey, null);
        history.replace('/login');
        return { code: '500', message: '登录失效，请重新登录' };
      }

      if (response.status === 404) {
        message.error('未找到相关页面');
        return { code: '404', message: '未找到相关页面' };
      }

      let errorMsg =
        response.data?.message || '报告！服务器出了点小问题，稍后再试试...';
      if (response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (res) => {
          const { result } = (res.target || {}) as any;
          const jsonRes = JSON.parse(result);
          errorMsg =
            jsonRes?.message || '报告！服务器出了点小问题，稍后再试试...';
          message.error({ content: errorMsg });
        };
        reader.readAsText(response.data, 'utf-8');
      } else {
        message.error({ content: errorMsg });
      }
      return { code: '500', message: errorMsg };
    }
    // 请求超时
    if (error.code === 'ECONNABORTED') {
      const msg = '请求超时，请稍后再试';
      message.error(msg);
      return { code: '500', message: msg };
    }
    // 默认错误提示
    const msg = '您的网络出现问题，请检查网络重试';
    message.error(msg);

    // eslint-disable-next-line no-console
    console.error(error);
    return { code: '500', message: msg };
  }
);

// 超时设置
const timeout = 1000 * 60 * 2;

export default async function request(
  { url, body = {}, headers = {}, ...options }: RequestOptions,
  host?: string
) {
  const h = host ?? config.apiHost;
  const auth = storage.get(config.authKey);
  const newOptions = {
    ...options,
    paramsSerializer: (params: any) => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
    validateStatus: (status: any) => {
      return status >= 200 && status < 300;
    },
    headers: {
      ...headers,
      [config.authKey]: auth,
    },
    url: h + url,
    withCredentials: true,
    data: body,
    timeout,
  };

  return axios(newOptions) as Promise<any>;
}
