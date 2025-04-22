export const getFilenameFromURL = (url: string) =>
  url.split('/').pop()?.split('?').shift() || '';
