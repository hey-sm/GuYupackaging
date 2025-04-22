import { CloseCircleFilled } from '@ant-design/icons';
import {
  BatchItem,
  FILE_STATES,
  useAbortItem,
  useItemAbortListener,
  useItemFinalizeListener,
  useItemProgressListener,
} from '@rpldy/uploady';
import { Image } from 'antd';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { extname } from '../utils';

import mp4Svg from './icons/mp4.svg';
import unknownSvg from './icons/unknown.svg';

interface UploadPreviewProps {
  item: BatchItem;
  onRemove?: (id: string) => void;
  imageMimeTypes?: string[];
  videoMimeTypes?: string[];
  fallbackUrl?: string;
}

const defaultImageMimeTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
const defaultVideoMimeTypes = ['mp4'];

const UploadPreviewComponent = (props: UploadPreviewProps) => {
  const {
    item,
    imageMimeTypes = defaultImageMimeTypes,
    videoMimeTypes = defaultVideoMimeTypes,
    fallbackUrl = unknownSvg,
  } = props;

  const url = item?.url;
  const ext = extname(url);

  if (imageMimeTypes.includes(ext)) {
    return <Image alt="" src={url} />;
  }

  if (videoMimeTypes.includes(ext)) {
    return <img alt="" src={mp4Svg} className="icon" />;
  }

  return <img alt="" src={fallbackUrl} className="icon" />;
};

export const UploadPreview = (props: UploadPreviewProps) => {
  const { item, onRemove } = props;

  const [itemState, setItemState] = useState<FILE_STATES>(FILE_STATES.PENDING);
  const [progress, setProgress] = useState<number>();
  useItemProgressListener((item) => {
    setItemState(item.state);
    setProgress(item.completed);
  }, item?.id);

  useItemFinalizeListener((item) => {
    setItemState(item.state);
  });

  useItemAbortListener((item) => {
    onRemove?.(item?.id);
  }, item?.id);

  const renderContent = useCallback(
    (itemState: FILE_STATES, progress?: number) => {
      if (itemState === FILE_STATES.UPLOADING) {
        return <span>{progress?.toFixed(2)}%</span>;
      }

      return <UploadPreviewComponent item={item} />;
    },
    [item]
  );

  const abortItem = useAbortItem();

  return (
    <Container>
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {renderContent(itemState, progress)}
        <span
          className="text-xs truncate w-full px-2 text-center"
          title={item?.file?.name}
        >
          {item?.file?.name}
        </span>
      </div>

      <a
        className="absolute -right-[4px] -top-[8px] text-[#DDDDDD]"
        onClick={() => {
          if (itemState === FILE_STATES.FINISHED) {
            onRemove?.(item?.id);
          } else {
            abortItem(item?.id);
          }
        }}
      >
        <CloseCircleFilled className="w-4 h-4 text-base" />
      </a>
    </Container>
  );
};

const Container = styled.div`
  width: 112px;
  height: 112px;
  background-color: #f0f2f5;
  position: relative;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .ant-image {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 4px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .icon {
    width: 88px;
    height: 88px;
  }
`;

export default UploadPreview;
