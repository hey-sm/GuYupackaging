import { PlusOutlined } from '@ant-design/icons';
import { createField } from '@ant-design/pro-form/es/BaseForm/createField';
import type { ProFormFieldItemProps } from '@ant-design/pro-form/es/typing';
import { message, Upload, UploadProps, Image, UploadFile } from 'antd';
import { uploadImage } from '@org/features/components';
import { last } from 'lodash-es';
import {
  forwardRef,
  FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

export interface OSSConfig {
  accessid: string;
  callback: string;
  dir: string;
  expire: string;
  host: string;
  policy: string;
  signature: string;
}

export type ProFormImageUploadProps = ProFormFieldItemProps<
  UploadProps<any>,
  HTMLElement
> & {
  max?: number;
  maxSize?: number;
  tips?: string;
  type?: string;
  value?: UploadProps['fileList'];
  onChange?: UploadProps['onChange'];
  accept?: UploadProps['accept'];
  getOSSConfig?: () => Promise<OSSConfig>;
};

const BaseProFormImageUpload: FC<ProFormImageUploadProps> = forwardRef(
  (
    {
      fieldProps,
      accept,
      onChange,
      value,
      max = 1,
      maxSize,
      type = 'picture-card',
      tips,
      getOSSConfig,
    },
    ref: any
  ) => {
    const [ossConfig, setOSSConfig] = useState<OSSConfig>();

    const init = useCallback(async () => {
      try {
        const result = getOSSConfig && (await getOSSConfig());
        setOSSConfig(result);
      } catch (error: any) {
        message.error(error);
      }
    }, [getOSSConfig]);

    useEffect(() => {
      init();
    }, [init]);

    const getExtraData: UploadProps['data'] = (file) => ({
      key: file.url,
      OSSAccessKeyId: ossConfig?.accessid,
      ...ossConfig,
    });

    const beforeUpload: UploadProps['beforeUpload'] = async (file: any) => {
      const suffix = file.name.slice(file.name.lastIndexOf('.'));
      if (accept) {
        const currentType: string = last(file.type.split('/')) ?? '';
        if (accept.indexOf(currentType) === -1) {
          message.warning('不支持的文件格式' + suffix);
          return Upload.LIST_IGNORE;
        }
      }
      if (maxSize && file?.size > maxSize) {
        message.warning(
          '超出文件大小限制,支持' + maxSize / 1024 / 1024 + 'M以内的文件上传'
        );
        return Upload.LIST_IGNORE;
      }
      return file;
    };

    const uploadProps: UploadProps = {
      name: 'file',
      fileList: value,
      action: ossConfig?.host,
      data: getExtraData,

      beforeUpload,
    };

    const uploadButton = useMemo(() => {
      if (type !== 'icon') return <PlusOutlined />;
      return <div className="icon_btn">+ 上传图标</div>;
    }, [type]);

    const multiple = max > 1;

    const [preview, setPreview] = useState<UploadFile>();
    const [open, setOpen] = useState<boolean>();

    return (
      <>
        <Upload
          {...uploadProps}
          ref={ref}
          accept={accept}
          fileList={value}
          multiple={multiple}
          {...fieldProps}
          onPreview={(file) => {
            setOpen(true);
            setPreview(file);
          }}
          className="upload_irtp"
          customRequest={uploadImage}
          listType={type === 'icon' ? 'text' : 'picture-card'}
          onChange={(info) => {
            onChange?.(info);
            if (fieldProps?.onChange) {
              fieldProps?.onChange(info);
            }
          }}
        >
          {(value?.length ?? 0) >= max ? null : uploadButton}
        </Upload>
        {tips && <span className="uploadDesc">{tips}</span>}
        <Image
          style={{ display: 'none' }}
          preview={{
            destroyOnClose: true,
            visible: open,
            src: preview?.response?.accessUrl
              ? preview?.response?.accessUrl
              : preview?.url,
            onVisibleChange: (value) => {
              setOpen(value);
            },
          }}
        />
      </>
    );
  }
);

export const ProFormImageUpload = createField<ProFormImageUploadProps>(
  BaseProFormImageUpload,
  {
    getValueFromEvent: (value: { fileList: UploadProps['fileList'] }) =>
      value.fileList,
  }
) as typeof BaseProFormImageUpload;

export default ProFormImageUpload;
