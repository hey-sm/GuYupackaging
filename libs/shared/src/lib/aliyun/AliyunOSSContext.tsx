import { Image, UploadFile } from 'antd';
import axios from 'axios';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createGlobalStyle, css } from 'styled-components';

type Signature = {
  accessid: string;
  callback: string;
  dir: string;
  expire: string;
  host: string;
  policy: string;
  signature: string;
  OSSAccessKeyId?: string;
};

export type AliyunOSSContextValue = {
  signature: Signature | undefined;
  refreshSignature: () => Promise<void>;
  onPreview: (file: UploadFile) => void;
};

export const AliyunOSSContext = createContext<
  AliyunOSSContextValue | undefined
>(undefined);

export type AliyunOSSProviderProps = {
  config: {
    uri: string;
    params?: any;
  };
} & { children: ReactNode };

export const AliyunOSSProvider: FC<AliyunOSSProviderProps> = (props) => {
  const { children, config } = props;

  const [signature, setSignature] = useState<Signature>();

  const requestSignature = useCallback(async () => {
    const data = await axios
      .get<Signature>(config.uri, { params: config.params })
      .then((res) => res.data);

    setSignature({
      ...data,
      OSSAccessKeyId: data?.accessid,
    });
  }, [config.params, config.uri]);

  const mounted = useRef(false);

  useEffect(() => {
    if (config?.uri && !mounted.current) {
      mounted.current = true;
      requestSignature();
    }
  }, [config?.uri, requestSignature]);

  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<UploadFile | null>(null);

  // TODO 单独一个context
  const handlePreview = useCallback((file: UploadFile) => {
    setFile(file);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      signature,
      refreshSignature: requestSignature,
      onPreview: handlePreview,
    }),
    [handlePreview, requestSignature, signature]
  );

  return (
    <AliyunOSSContext.Provider value={value}>
      {children}

      {/* <Image
        wrapperClassName="aliyun-oss-img"
        preview={{
          visible: open,
          src: file?.url || file?.response?.resourceUrl,
          onVisibleChange: setOpen,
        }}
      />
      <GlobalStyle /> */}
    </AliyunOSSContext.Provider>
  );
};

const GlobalStyle = createGlobalStyle`${css`
  .aliyun-oss-img {
    display: none;
    .antd-image-img,
    .ant-image-mask {
      display: none;
    }
  }
`}
`;
