import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message, Typography } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

export declare type ResourceFile = {
  /** 资源id */
  uid: string;
  /** 资源地址 */
  url: string;
  /** 名称 */
  name: string;
};

interface IProps {
  listType?: 'text' | 'picture' | 'picture-card';
  headers?: { [key: string]: any };
  signature?: any;
  fileMaxSize?: number;
  maxNumber?: number;
  value?: Array<ResourceFile>;
  placeholder?: string;
  accept?: string;
  onChange?: (v: Array<ResourceFile>) => void;
  onError?: () => void;
}

export const OssUploadFile: React.FC<IProps> = ({
  listType = 'text',
  signature,
  placeholder,
  headers,
  value,
  onChange,
  fileMaxSize = 5,
  maxNumber = 5,
  onError,
  accept,
}) => {
  const [fileList, setFileList] = React.useState<Array<UploadFile<RcFile>>>([]);

  const [error, setError] = useState(false);

  useEffect(() => {
    if (value && value.length > 0) {
      setFileList(value);
    }
  }, [value]);

  /** 上传之前，检查大小 */
  const handleBeforeUpload = (file: RcFile) => {
    if (file.size / 1024 / 1024 > fileMaxSize) {
      message.error(`文件必须小于${fileMaxSize}MB!`);
      return false;
    }

    return true;
  };

  const handleUploadChange = ({ fileList }: any) => {
    const hasError = fileList.some((v: any) => v.status === 'error');
    setError(hasError);

    if (hasError) {
      onError?.();
    }

    const result: Array<UploadFile<RcFile>> = fileList.map((v: any) => {
      return {
        ...v,
        ...(v.status === 'done'
          ? { uid: v.response.resourceId, url: v.response.resourceUrl }
          : {}),
      };
    });

    // setFileList(result.filter((v) => v.status !== 'error'));

    onChange?.(result as ResourceFile[]);
  };

  /** 上传按钮样式 */
  const uploadButtons = (
    <div>
      <Button icon={<UploadOutlined />}>{placeholder || '上传文件'}</Button>
      &nbsp;&nbsp;
      {error && (
        <Typography.Text type="danger">上传发生错误，请重试</Typography.Text>
      )}
    </div>
  );

  const uploadData = useCallback(
    (file: UploadFile) => {
      const fileName = nanoid() + file.name;
      return {
        name: fileName,
        key: signature?.dir + fileName,
        policy: signature?.policy,
        OSSAccessKeyId: signature?.accessid,
        success_action_status: '200',
        callback: signature?.callback,
        signature: signature?.signature,
      };
    },
    [signature]
  );

  return (
    <Container
      listType={listType}
      className="oss-upload"
      accept={accept}
      data={uploadData}
      action={`${signature?.host}`}
      headers={headers}
      beforeUpload={handleBeforeUpload}
      onChange={handleUploadChange}
      multiple={maxNumber > 1}
      fileList={fileList}
      maxCount={maxNumber}
      onRemove={(file) =>
        setFileList(fileList.filter((v) => v.uid !== file.uid))
      }
      progress={{
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: (percent) => `${parseFloat((percent ?? 0).toFixed(2))}%`,
      }}
    >
      {fileList.length < maxNumber && uploadButtons}
    </Container>
  );
};

const Container = styled(Upload)`
  .ant-tooltip {
    display: none;
  }
`;

export default OssUploadFile;
