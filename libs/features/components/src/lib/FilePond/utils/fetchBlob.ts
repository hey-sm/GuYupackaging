import axios from 'axios';
import { getFileFromBlob } from './getFileFromBlob';
import { getFilenameFromURL } from './getFilenameFromURL';

export const fetchBlob = (url: string) => {
  return axios.get(url, { responseType: 'blob' }).then((response) => {
    const filename = getFilenameFromURL(url);
    return getFileFromBlob(response.data, filename);
  });
};
