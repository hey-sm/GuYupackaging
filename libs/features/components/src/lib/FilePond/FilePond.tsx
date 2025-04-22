import Uploady, { FileFilterMethod } from '@rpldy/uploady';
import { message, Spin } from 'antd';
import axios from 'axios';

import { sum } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  FileUploadSignatureResponse,
  FileUploadSignatureRequest,
} from '../FileUpload';

import FilePondDropZone from './FilePondDropZone';
import FilePondPanel from './FilePondPanel';
import {
  FilePondProps,
  FilePondProvider,
  useFilePond,
} from './context/FilePondContext';

export const FilePond = (props: FilePondProps) => {
  return (
    <FilePondProvider {...props}>
      <Container className={props.className}>
        <FilePondComponent />
      </Container>
    </FilePondProvider>
  );
};

const FilePondComponent = () => {
  const {
    maxFiles = null,
    signature: signatureProp,
    enhancer,
    validateType,
    validateSize,
    onUpdateFiles,
  } = useFilePond();

  const [signature, setSignature] = useState<FileUploadSignatureResponse>();

  const { files: activeFiles } = useFilePond();

  // TODO 优化
  useEffect(() => {
    onUpdateFiles?.(activeFiles);
  }, [activeFiles, onUpdateFiles]);

  const fetchSignature = useCallback(
    async (signatureProp: FileUploadSignatureRequest) => {
      axios
        .get<FileUploadSignatureResponse>(signatureProp.url, {
          params: signatureProp.params,
        })
        .then((res) => {
          setSignature(res.data);
        });
    },
    []
  );

  useEffect(() => {
    if (signatureProp?.url) {
      fetchSignature(signatureProp);
    }
  }, [fetchSignature, signatureProp]);

  const destination = useMemo(() => {
    if (signature) {
      return {
        url: signature.host,
        filesParamName: 'file',
        params: {
          key: signature?.dir,
          policy: signature?.policy,
          OSSAccessKeyId: signature?.accessid,
          success_action_status: '200',
          callback: signature?.callback,
          signature: signature?.signature,
        },
        method: 'POST',
      };
    }
    return undefined;
  }, [signature]);

  // TODO 如何展示限制数量
  const fileFilter: FileFilterMethod = useCallback(
    (file: File | string, index: number, files: any[]) => {
      if (validateSize && validateSize.maxTotalFileSize) {
        const currentTotalSize = sum(
          files.filter((v) => v instanceof Blob).map((v) => v.size ?? 0)
        );

        if (currentTotalSize > validateSize.maxTotalFileSize) {
          message.warn(validateSize.labelMaxTotalFileSizeExceeded);
          return false;
        }
      }

      const count = activeFiles.length + files.length;

      const maxFileCount = maxFiles;

      if (maxFileCount === null) {
        return true;
      }

      if (count <= maxFileCount) {
        return true;
      }

      message.warn(`最大上传数量为${maxFileCount ?? 1}`);

      return false;
    },
    [activeFiles.length, maxFiles, validateSize]
  );
  console.log(signature, 'signature');

  // if (!signature) {
  //   return (
  //     <Spin>
  //       <div className="h-[144px]"></div>
  //     </Spin>
  //   );
  // }

  return (
    <Uploady
      // debug
      destination={destination}
      enhancer={enhancer}
      accept={validateType?.acceptedFileTypes?.join(',')}
      fileFilter={fileFilter}
    >
      <FilePondDropZone />
      <FilePondPanel />
    </Uploady>
  );
};

const Container = styled.div`
  background-color: #edf0f4;
  border-radius: 10px;
`;

export default FilePond;
