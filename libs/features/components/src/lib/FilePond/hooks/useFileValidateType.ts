import { BatchItem, useItemStartListener } from '@rpldy/uploady';
import { useCallback, useMemo } from 'react';
import { useFilePond } from '../context/FilePondContext';
import { FileItem } from '../types';
import {
  getFilenameFromURL,
  getExtensionFromFilename,
  guesstimateMimeType,
} from '../utils';

export interface FileValidateTypeOptions {
  acceptedFileTypes?: string[];
  labelFileTypeNotAllowed?: string;
  fileValidateTypeDetectType?: FileValidateTypeDetectType;
}

export type FileValidateTypeDetectType = (
  file: FileItem,
  type: string
) => string;

const mimeTypeMatchesWildCard = (mimeType: string, wildcard: string) => {
  const mimeTypeGroup = (/^[^/]+/.exec(mimeType) || []).pop(); // image/png -> image
  const wildcardGroup = wildcard.slice(0, -2); // image/* -> image
  return mimeTypeGroup === wildcardGroup;
};

const getItemType = (item: BatchItem) => {
  let type = '';

  if (item.url) {
    const filename = getFilenameFromURL(item.url);
    const extension = getExtensionFromFilename(filename);

    if (extension) {
      type = guesstimateMimeType(extension);
    }
  } else {
    type = item.file.type;
  }

  return type;
};

const isValidMimeType = (acceptedTypes: string[], userInputType: string) =>
  acceptedTypes.some((acceptedType) => {
    // accepted is wildcard mime type
    if (/\*$/.test(acceptedType)) {
      return mimeTypeMatchesWildCard(userInputType, acceptedType);
    }
    // is normal mime type
    return acceptedType === userInputType;
  });

const useFileValidateType = (id: string) => {
  const { validateType } = useFilePond();
  const { setFiles } = useFilePond();

  const labelFileTypeNotAllowed = useMemo(
    () => validateType?.labelFileTypeNotAllowed ?? '无效文件类型',
    [validateType?.labelFileTypeNotAllowed]
  );

  const validateFile = useCallback(
    (
      item: BatchItem,
      acceptedFileTypes: string[] = [],
      typeDetector?: FileValidateTypeDetectType
    ) => {
      if (acceptedFileTypes.length === 0) {
        return true;
      }

      const type = getItemType(item);

      if (!typeDetector) {
        return isValidMimeType(acceptedFileTypes, type);
      }

      const detectedType = typeDetector(item, type);

      if (isValidMimeType(acceptedFileTypes, detectedType)) {
        return true;
      }

      return false;
    },
    []
  );

  useItemStartListener((item) => {
    if (!validateType) {
      return true;
    }

    const validationResult = validateFile(
      item,
      validateType?.acceptedFileTypes,
      validateType?.fileValidateTypeDetectType
    );
    if (!validationResult) {
      setFiles((draft) => {
        const file = draft.find((v) => v.id === id);
        if (file) {
          file.error = labelFileTypeNotAllowed;
        }
      });
    }
    return validationResult;
  }, id);
};

export default useFileValidateType;
