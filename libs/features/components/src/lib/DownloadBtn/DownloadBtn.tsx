import { LoadingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ButtonProps } from 'antd';
import axios from 'axios';
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

interface IProps extends ButtonProps {
  url?: string;
  fileName?: string;
  onSuccess?: () => any;
  onFailed?: (err: Error) => any;
  onFinished?: () => any;
  children?: string;
}

export const DownloadBtn = ({
  url,
  fileName,
  onSuccess,
  onFailed,
  onFinished,
  children,
  ...rest
}: IProps): React.ReactElement => {
  const [status, setStatus] = useState<'finished' | 'loading'>('finished');

  const onDownload = () => {
    if (!url || !fileName) return;
    if (status === 'loading') return;
    setStatus('loading');
    axios
      .get(url, {
        responseType: 'blob',
      })
      .then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .then(() => {
        onSuccess?.();
      })
      .catch((err) => {
        onFailed?.(err);
      })
      .finally(() => {
        onFinished?.();
        setStatus('finished');
      });
  };

  const text = useMemo(() => {
    switch (status) {
      case 'loading':
        return <LoadingOutlined />;
      case 'finished':
        return children;
      default:
        return '下载';
    }
  }, [status]);

  return (
    <DownloadBtnStyled
      type="link"
      {...rest}
      onClick={onDownload}
      style={{ cursor: status === 'finished' ? 'pointer' : 'default' }}
    >
      {text}
    </DownloadBtnStyled>
  );
};

const DownloadBtnStyled = styled(Button)`
  padding: 0;
`;

export default DownloadBtn;
