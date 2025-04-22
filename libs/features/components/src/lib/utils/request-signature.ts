import { useQuery } from '@tanstack/react-query';
import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { nanoid } from 'nanoid';
import extname from './extname';

/**
 * 获取阿里云签名
 * @param product
 * @returns
 */
export interface ResourceSignature {
  accessid: string;
  callback: string;
  dir: string;
  expire: string;
  host: string;
  policy: string;
  signature: string;
}

export const getQueryParamsKey = (params: any) => {
  return [params.service, params];
};

// 获取地区列表数据
export const useRegionTree = () => {
  return useQuery(getQueryParamsKey({ service: 'tree' }), async () => {
    const response = await axios.get('/acooly/data/region/tree');
    return response.data;
  });
};

export function upload(file: File, path: string, onProgress?: any) {
  const timestamp = moment().format('yyyyMMddHHmmss');
  // const fileName = moment().format('yyyyMMddHHmmssSSS') + file.type; //'.jpg'
  const fileName = file.name; //'.jpg'
  // 计算签名

  const form: FormData = new FormData();
  if (path === '/ofile/upload.html') {
    form.append('timestamp', timestamp);
    form.append('fileName', fileName);
    form.append('fileName', file, fileName);
  } else {
    form.append('file', file, fileName);
  }
  const token = JSON.parse(localStorage.getItem('token') as any)?.state
    ?.session;
  return axios.post(path, form, {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      onProgress &&
        onProgress(
          { percent: (event.loaded / (event.total ?? 0)) * 100 },
          file
        );
    },
  });
}

// 文件上传
export const uploadImage = (
  options: any,
  callBack?: (data: any, error?: any) => void,
  path = '/ofile/upload.html'
) => {
  const { onSuccess, onError, file, onProgress } = options;
  if (file?.size < 30 * 1024 * 1024) {
    upload(file, path, onProgress)
      .then((res) => {
        const data = res.data.rows[0];
        const uploadFile =
          path === '/ofile/upload.html'
            ? { ...data, url: data.accessUrl }
            : res.data.rows;
        onSuccess && onSuccess(uploadFile);
        callBack && callBack(uploadFile, res?.data);
      })
      .catch((err) => {
        message.error(
          err?.response?.data?.exceptionMsg ?? err?.response?.data?.message
        );
        onError && onError({ event: err });
        callBack && callBack([], err);
      });
  } else {
    message.warning('上传文件过大了');
  }
};

// TODO product 应该从env读取
export function requestSignature() {
  // console.log(import.meta.env.VITE_FILE_URL,'import.meta.env.VITE_FILE_URL')
  // return axios
  //   .post<ResourceSignature>(import.meta.env.VITE_FILE_URL)
  //   .then((res) => res.data);
  return true;
}

export async function getSignatureParams(
  signature: ResourceSignature,
  fileName: string
) {
  return {
    name: fileName,
    key: signature?.dir + nanoid() + '.' + extname(fileName),
    policy: signature?.policy,
    OSSAccessKeyId: signature?.accessid,
    success_action_status: '200',
    callback: signature?.callback,
    signature: signature?.signature,
  };
}
