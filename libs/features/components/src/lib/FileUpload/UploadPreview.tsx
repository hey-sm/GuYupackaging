import { Image } from 'antd';
import styled from 'styled-components';
import { extname } from '../utils';

import mp4Svg from './icons/mp4.svg';
import unknownSvg from './icons/unknown.svg';

interface UploadPreviewProps {
  url?: string;
  imageMimeTypes?: string[];
  videoMimeTypes?: string[];
  fallbackUrl?: string;
}

const defaultImageMimeTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
const defaultVideoMimeTypes = ['mp4'];

const UploadPreviewComponent = (props: UploadPreviewProps) => {
  const {
    url,
    imageMimeTypes = defaultImageMimeTypes,
    videoMimeTypes = defaultVideoMimeTypes,
    fallbackUrl = unknownSvg,
  } = props;

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
  return (
    <Container>
      <UploadPreviewComponent {...props} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
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
