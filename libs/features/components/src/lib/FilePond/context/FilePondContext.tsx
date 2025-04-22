import { UploaderEnhancer } from '@rpldy/uploady';
import { remove } from 'lodash-es';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { DraftFunction, useImmer } from 'use-immer';
import { ImagePreviewOptions } from '../FilePondImagePreview';

import { FileValidateSizeOptions } from '../hooks/useFileValidateSize';
import { FileValidateTypeOptions } from '../hooks/useFileValidateType';
import { FileItem } from '../types';

export interface FileUploadSignatureResponse {
  accessid: string;
  callback: string;
  dir: string;
  expire: string;
  host: string;
  policy: string;
  signature: string;
}

export interface FileUploadSignatureRequest {
  url: string;
  params: {
    product: string;
  };
}

export interface FilePondProps {
  className?: string;
  signature: FileUploadSignatureRequest;
  enhancer?: UploaderEnhancer;
  maxFiles?: number | null;
  validateType?: FileValidateTypeOptions;
  validateSize?: FileValidateSizeOptions;
  imagePreview?: ImagePreviewOptions;
  initialFiles?: FileItem[];
  files?: FileItem[];
  onUpdateFiles?: (files: FileItem[]) => void;
}

export interface FilePondContextValue extends FilePondProps {
  files: FileItem[];
  setFiles: (files: DraftFunction<FileItem[]>) => void;
  removeItem: (item: FileItem) => void;
}

export const FilePondContext = createContext<FilePondContextValue | undefined>(
  undefined
);

export const FilePondProvider = ({
  children,
  initialFiles = [],
  ...rest
}: FilePondProps & { children?: React.ReactNode }) => {
  const [files, setFiles] = useImmer<FileItem[]>(initialFiles);

  const removeItem = useCallback(
    (item: FileItem) => {
      setFiles((draft) => {
        remove(draft, (v) => v.id === item.id);
      });
    },
    [setFiles]
  );

  const value = useMemo(
    () => ({ ...rest, files, setFiles, removeItem }),
    [files, removeItem, rest, setFiles]
  );

  return (
    <FilePondContext.Provider value={value}>
      {children}
    </FilePondContext.Provider>
  );
};

export const useFilePond = () => {
  const contextValue = useContext(FilePondContext);
  return contextValue || ({} as FilePondContextValue);
};
