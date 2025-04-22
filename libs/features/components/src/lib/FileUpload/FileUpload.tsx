import { CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { Upload, UploadFile } from 'antd';
import { ItemRender, UploadProps } from 'antd/lib/upload/interface';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import UploadPreview from './UploadPreview';

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

export interface FileUploadProps
  extends Omit<UploadProps, 'onChange' | 'listType' | 'itemRender'> {
  signature?: FileUploadSignatureRequest;
  value?: UploadFile[];
  onChange?: (value: UploadFile[]) => void;
}

export const FileUpload = ({
  signature: signatureProp,
  value = [],
  onChange,
  ...rest
}: FileUploadProps) => {
  const [signature, setSignature] = useState<FileUploadSignatureResponse>();

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

  const itemRender: ItemRender = useCallback(
    (originNode: React.ReactElement, file: UploadFile, fileList, actions) => {
      if (file.status === 'uploading') {
        return (
          <div className="w-[112px] h-[112px] flex items-center justify-center text-[#3278FF] bg-[#F0F2F5] rounded relative">
            <LoadingOutlined />
            <span className="ml-2 text-sm">{file.percent?.toFixed(2)}%</span>

            <a
              onClick={actions.remove}
              className="absolute -right-[4px] -top-[4px] text-[#DDDDDD]"
            >
              <CloseCircleFilled className="w-4 h-4 text-base" />
            </a>
          </div>
        );
      }

      if (file.status === 'error') {
        return (
          <div className="w-[112px] h-[112px] flex items-center justify-center bg-[#F0F2F5] rounded relative">
            <span className="mr-2 text-xs text-red-500">上传失败</span>

            <a
              onClick={actions.remove}
              className="absolute -right-[4px] -top-[4px] text-[#DDDDDD]"
            >
              <CloseCircleFilled className="w-4 h-4 text-base" />
            </a>
          </div>
        );
      }

      return (
        <div className="w-[112px] h-[112px] flex items-center justify-center bg-[#F0F2F5] rounded relative">
          <UploadPreview url={file.url} />
          <a
            onClick={actions.remove}
            className="absolute -right-[4px] -top-[4px] text-[#DDDDDD]"
          >
            <CloseCircleFilled className="w-4 h-4 text-base" />
          </a>
        </div>
      );
    },
    []
  );

  const uploadData = useMemo(() => {
    if (signature) {
      const key = nanoid();
      return {
        name: key,
        key: signature?.dir + key,
        policy: signature?.policy,
        OSSAccessKeyId: signature?.accessid,
        success_action_status: '200',
        callback: signature?.callback,
        signature: signature?.signature,
      };
    }
    return null;
  }, [signature]);

  return (
    <Container>
      <Upload.Dragger
        {...rest}
        action={signature?.host ?? rest.action}
        data={uploadData ?? rest.data}
        fileList={value}
        listType="picture-card"
        onChange={(info) => {
          const files = info.fileList.map((v) => {
            const done = ['done', 'success'].includes(v.status ?? 'done');
            return {
              ...v,
              uid: done && signature ? v.response?.id : v.uid,
              url: done && signature ? v.response?.resourceUrl : v.thumbUrl,
            };
          });

          onChange?.(files);
        }}
        itemRender={itemRender}
        beforeUpload={(file, fileList) => {
          if (rest.beforeUpload) return rest.beforeUpload?.(file, fileList);
          return true;
        }}
      >
        <a className="text-[#3278FF]">点击上传</a>
        <span className="mx-2">/</span>
        <span className="text-[rgba(0,0,0,0.6)]">拖拽到此区域</span>
      </Upload.Dragger>
    </Container>
  );
};

const Container = styled.div`
  min-height: 144px;
  .anticon {
    display: block;
  }

  .ant-upload {
    margin-bottom: 20px;
  }

  .ant-upload-list-item {
    width: 112px;
    height: 112px;
  }

  .ant-upload-list-picture-card-container {
    width: 112px;
    height: 112px;
    margin: 0 50px 20px 0;
  }

  .ant-upload-list {
    &::before,
    &::after {
      display: none;
    }
    &.ant-upload-list-picture-card {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .ant-upload.ant-upload-drag {
    height: 160px;
  }
`;

export default FileUpload;
