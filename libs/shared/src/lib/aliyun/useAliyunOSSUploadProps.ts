import { UploadFile, UploadProps } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useCallback } from 'react';
import { useAliyunOSSContext } from './useAliyunOSSContext';

export type AliyunOSSUploadProps = Required<
  Pick<UploadProps, 'action' | 'data' | 'beforeUpload' | 'onPreview'>
>;

export const useAliyunOSSUploadProps = () => {
  const { signature, refreshSignature, onPreview } = useAliyunOSSContext();

  const getExtraData: UploadProps['data'] = useCallback(
    (file: UploadFile) => ({
      key: file.url,
      OSSAccessKeyId: signature?.accessid,
      ...signature,
    }),
    [signature]
  );

  const beforeUpload: UploadProps['beforeUpload'] = useCallback(
    async (file: any, FileList: RcFile[]) => {
      if (!signature) return false;

      const expire = Number(signature.expire) * 1000;

      if (expire < Date.now()) {
        await refreshSignature();
      }

      const suffix = file.name.slice(file.name.lastIndexOf('.'));
      const filename = Date.now() + suffix;

      file.url = signature.dir + filename;
      return file;
    },
    [refreshSignature, signature]
  );

  const uploadProps: AliyunOSSUploadProps = {
    action: signature?.host ?? '',
    data: getExtraData,
    beforeUpload,
    onPreview,
  };

  return uploadProps;
};
