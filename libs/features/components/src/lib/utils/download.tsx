import {
  LoadingOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import styled from 'styled-components';

interface Params {
  url: string;
  filename: string;
  root?: HTMLElement;
  onSuccess?: () => void;
  onError?: () => void;
  onFinished?: () => void;
}

export const Download = ({
  url,
  filename,
  root: documentRoot = document.body,
  onFinished,
  onSuccess,
  onError,
}: Params) => {
  const wrap = document.createElement('div');
  documentRoot.appendChild(wrap);
  const root = createRoot(wrap);
  root.render(
    <DownloadPage
      url={url}
      filename={filename}
      root={root}
      wrap={wrap}
      onFinished={onFinished}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
};

//下载显示组件
export const DownloadPage = ({
  url,
  filename,
  root,
  wrap,
  onFinished,
  onSuccess,
  onError,
}: Omit<Params, 'root'> & {
  root: Root;
  wrap: HTMLElement;
}): React.ReactElement => {
  //下载状态
  const [status, setStatus] = useState<
    'loading' | 'finished' | 'error' | 'outing'
  >('loading');

  //下载进度%
  const [loading, setLoading] = useState(0);

  //开始下载
  const onDownload = () => {
    if (!url || !filename) return;
    setLoading(0);
    setStatus('loading');
    axios
      .get(url, {
        responseType: 'blob',
        onDownloadProgress(progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
          );
          setLoading(percentCompleted);
        },
      })
      .then((response) => {
        const href = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .then(() => {
        setStatus('finished');
        onSuccess?.();
      })
      .catch((err) => {
        if (err) {
          setStatus('error');
          onError?.();
        }
      })
      .finally(() => {
        onFinished?.();
        finishedtimer.current = window.setTimeout(() => {
          setStatus('outing');
          outingTimer.current = window.setTimeout(() => {
            root.unmount();
          }, 500);
        }, 1000);
      });
  };

  //清除副作用
  useEffect(() => {
    onDownload();
    return () => {
      finishedtimer.current = null;
      outingTimer.current = null;
      wrap.parentElement?.removeChild(wrap);
    };
  }, [url, filename]);

  const finishedtimer = useRef<null | number>(1);
  const outingTimer = useRef<null | number>(0.5);

  //展示字段
  const message = useMemo<React.ReactNode>(() => {
    switch (status) {
      case 'loading':
        return (
          <>
            <LoadingOutlined />
            <span className="ml-[10px]">下载进度:{loading}%</span>
          </>
        );
      case 'error':
        return (
          <>
            <CloseOutlined />
            <span className="ml-[10px]">下载失败</span>
          </>
        );
      case 'finished':
        return (
          <>
            <CheckOutlined />
            <span className="ml-[10px]">下载成功</span>
          </>
        );
      default:
        return '';
    }
  }, [status, loading]);

  return (
    <DownloadPageStyled>
      <div
        className={`fixed right-[15px] top-[40px] w-[200px] h-[50px] leading-[50px] z-50 text-center  bg-[#fff] rounded-[10px]  ${status}`}
      >
        {message}
      </div>
    </DownloadPageStyled>
  );
};

const DownloadPageStyled = styled.div`
  .loading {
    animation: getIn 0.5s;
  }

  .outing {
    animation: getOut 0.5s;
  }

  @keyframes getIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes getOut {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0);
    }
  }
`;
