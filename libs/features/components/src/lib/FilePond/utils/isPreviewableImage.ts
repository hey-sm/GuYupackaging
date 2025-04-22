import { FileLike } from '@rpldy/shared';

export const isPreviewableImage = (file?: FileLike) =>
  /^image/.test(file?.type || '');
