import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { take } from 'lodash-es';
import React, { useEffect } from 'react';
import { useAliyunOSSUploadProps } from '../../aliyun';

export declare type ResourceFile = {
  /** 资源id */
  uid: string;
  /** 资源地址 */
  url: string;
  /** 名称 */
  name: string;
};

interface IProps {
  headers?: { [key: string]: any };
  fileMaxSize?: number;
  maxNumber?: number;
  value?: Array<ResourceFile>;
  placeholder?: string;
  onChange?: (v: Array<ResourceFile>) => void;
}

export const FileUpload: React.FC<IProps> = ({
  placeholder,
  headers,
  value,
  onChange,
  fileMaxSize = 5,
  maxNumber = 5,
}) => {
  const [imgFiles, setImgFiles] = React.useState<Array<UploadFile<RcFile>>>([]);

  useEffect(() => {
    if (value && value.length > 0) {
      setImgFiles(value);
    }
  }, [value]);

  /** 移除错误文件 */
  const removeErrorFile = (file: RcFile, fileList: Array<RcFile>) => {
    const index = fileList.findIndex((v) => v.uid === file.uid);
    fileList.splice(index, 1);
  };

  const uploadProps = useAliyunOSSUploadProps();
  /** 上传之前，检查大小 */
  const handleBeforeUpload = async (file: RcFile, fileList: Array<RcFile>) => {
    if (file.size / 1024 / 1024 > fileMaxSize) {
      removeErrorFile(file, fileList);
      message.error(`文件必须小于${fileMaxSize}MB!`);
      return false;
    }

    if (fileList.length + imgFiles.length > maxNumber) {
      const list = take(fileList, maxNumber - imgFiles.length);
      const has = list.some((v) => v.uid === file.uid);
      if (!has) removeErrorFile(file, fileList);
      return has;
    }

    return await uploadProps.beforeUpload?.(file, fileList);
  };

  const handleUploadChange = ({ fileList }: any) => {
    const list: Array<UploadFile<RcFile>> = fileList.map(
      (v: {
        response: {
          resourceId: Record<string, unknown>;
          path: Record<string, unknown>;
        };
      }) => ({
        ...v,
        ...(v.response
          ? { uid: v.response.resourceId, url: v.response.path }
          : {}),
      })
    );
    const v: Array<ResourceFile> = list.map((v: UploadFile<RcFile>) => ({
      uid: v.uid,
      url: v.url || '',
      name: v.name,
    }));
    setImgFiles(v);
    if (onChange) {
      onChange(v);
    }
  };

  /** 上传按钮样式 */
  const uploadButtons = (
    <div>
      <Button icon={<UploadOutlined />}>{placeholder || '上传文件'}</Button>
    </div>
  );

  return (
    <Upload
      action={uploadProps.action}
      data={uploadProps.data}
      headers={headers}
      beforeUpload={handleBeforeUpload}
      onChange={handleUploadChange}
      multiple={maxNumber > 1}
      listType="text"
      className="avatar-uploader"
      fileList={imgFiles}
    >
      {imgFiles.length < maxNumber && uploadButtons}
    </Upload>
  );
};

export default FileUpload;
