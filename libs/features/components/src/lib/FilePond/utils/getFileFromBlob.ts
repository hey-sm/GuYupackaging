import { isString } from 'lodash-es';
import moment from 'moment';
import { getExtensionFromFilename } from './getExtensionFromFilename';
import { guesstimateExtension } from './guesstimateExtension';

export const getFileFromBlob = (
  blob: Blob,
  filename: string,
  type: string | null = null,
  extension: string | null = null
) => {
  const file: any =
    typeof type === 'string'
      ? blob.slice(0, blob.size, type)
      : blob.slice(0, blob.size, blob.type);
  file.lastModifiedDate = new Date();

  // if blob has name property, use as filename if no filename supplied
  if (!isString(filename)) {
    filename = moment().format('YYYY-MM-DD HH:mm:ss');
  }

  // if filename supplied but no extension and filename has extension
  if (filename && extension === null && getExtensionFromFilename(filename)) {
    file.name = filename;
  } else {
    extension = extension || guesstimateExtension(file.type);
    file.name = filename + (extension ? '.' + extension : '');
  }

  return file;
};
