import { useItemStartListener } from '@rpldy/uploady';
import { merge, sum } from 'lodash-es';
import { useMemo } from 'react';
import { useFilePond } from '../context/FilePondContext';

export interface FileValidateSizeOptions {
  minFileSize?: number;
  maxFileSize?: number;
  maxTotalFileSize?: number;
  labelMaxFileSizeExceeded?: string;
  labelMaxFileSize?: string;
  labelMaxTotalFileSizeExceeded?: string;
  labelMaxTotalFileSize?: string;
}

export const defaultFileValidateSize: FileValidateSizeOptions = {
  labelMaxFileSizeExceeded: 'File is too large',
  labelMaxTotalFileSizeExceeded: 'Maximum total size exceeded',
};

const useFileValidateSize = (id: string) => {
  const { validateSize } = useFilePond();

  const { files, setFiles } = useFilePond();

  const options = useMemo(
    () => merge(validateSize || {}, defaultFileValidateSize),
    [validateSize]
  );

  useItemStartListener((item) => {
    if (!validateSize) {
      return true;
    }

    const sizeMax = options.maxFileSize;

    if (sizeMax && item.file.size > sizeMax) {
      setFiles((draft) => {
        const file = draft.find((v) => v.id === id);

        if (file) {
          file.error =
            options.labelMaxFileSize ?? options.labelMaxFileSizeExceeded;
        }
      });
      return false;
    }

    const totalSizeMax = options.maxTotalFileSize;

    if (totalSizeMax) {
      const currentTotalSize = sum(files.map((v) => v.file?.size ?? 0));

      if (currentTotalSize > totalSizeMax) {
        setFiles((draft) => {
          const file = draft.find((v) => v.id === id);
          if (file) {
            file.error =
              options.labelMaxTotalFileSize ??
              options.labelMaxTotalFileSizeExceeded;
          }
        });
        return false;
      }
    }
    return true;
  }, id);
};

export default useFileValidateSize;
