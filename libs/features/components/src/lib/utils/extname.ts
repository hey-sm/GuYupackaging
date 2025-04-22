export const extname = (url?: string) => {
  if (url) {
    const index = url.lastIndexOf('.');
    return url.substring(index + 1) || '';
  }
  return '';
};

export default extname;
