/*
 * @Author: liaolin
 * @Date: 2023-04-15 10:42:18
 * @LastEditors: liaolin
 * @LastEditTime: 2023-05-05 10:57:48
 * @Description: 导出
 */
import axios from 'axios';
import { useSessionStore } from '../auth';
type Type = 'fetch' | 'axios';

export const useBlobDownload = (type: Type = 'fetch') => {
  if (type === 'fetch') {
    return fetchDownload;
  } else if (type === 'axios') {
    return axiosDownload;
  } else return fetchDownload;
};

const fetchDownload = (src: string, name: string, suffix: string) => {
  // using Java Script method to get PDF file
  fetch(src).then((response) => {
    response.blob().then((blob) => {
      // Creating new object of PDF file
      const fileURL = window.URL.createObjectURL(blob);
      // Setting various property values
      const alink = document.createElement('a');
      alink.href = fileURL;
      alink.download = `${name}.${suffix}`;
      alink.click();
    });
  });
};

const axiosDownload = (
  src: string,
  name: string,
  suffix: string,
  data:any,
  headers = {},
  callBack?:()=> void
) => {
  const session = useSessionStore.getState().session;
  const header = {
    Authorization: session
  }
  axios({
    url: src,
    method: 'GET',
    headers: {...header, ...headers},
    params: data,
    responseType: 'blob', // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}.${suffix}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    callBack?.()
  });
};
