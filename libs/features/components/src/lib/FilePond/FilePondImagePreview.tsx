import { FILE_STATES } from '@rpldy/uploady';
import { useMemo } from 'react';
import styled from 'styled-components';
import FilePondListItemFile from './FilePondListItemFile';
import ImageOverlayView from './ImageOverlayView';
import useFileItem from './hooks/useFileItem';

export interface ImagePreviewOptions {
  imagePreviewHeight?: number;
  imagePreviewMinHeight?: number; // default 44
  imagePreviewMaxHeight?: number; // default 256
  imagePreviewMaxFileSize?: number;
  imagePreviewZoomFactor?: number; // default 2
  imagePreviewUpscale?: boolean; // default false
  imagePreviewMaxInstantPreviewFileSize?: number; // default 1000000
}

interface FilePondImagePreviewProps extends ImagePreviewOptions {
  id: string;
}

export const FilePondImagePreview = (props: FilePondImagePreviewProps) => {
  const { id, imagePreviewMinHeight = 44, imagePreviewMaxHeight = 256 } = props;

  const { file, state } = useFileItem(id);

  const fileURL = useMemo(() => {
    if (file?.file) {
      return URL.createObjectURL(file?.file as File);
    }

    return undefined;
  }, [file]);

  return (
    <Container
      state={state}
      imagePreviewMinHeight={imagePreviewMinHeight}
      imagePreviewMaxHeight={imagePreviewMaxHeight}
    >
      <div className="file">
        <FilePondListItemFile id={id} />
      </div>
      <ImageOverlayView id={id} state={state} />

      <div className="w-full h-full">
        {
          <img
            src={fileURL}
            alt={file?.name}
            className=" h-64 w-full object-contain"
          />
        }
      </div>
    </Container>
  );
};

const Container = styled.div<{
  state: FILE_STATES;
  imagePreviewMinHeight: number;
  imagePreviewMaxHeight: number;
}>`
  position: relative;
  margin: 0.25em;
  min-height: ${(props) => props.imagePreviewMinHeight}px;
  max-height: ${(props) => props.imagePreviewMaxHeight}px;
  border-radius: 0.5em;
  overflow: hidden;

  .file {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 2;
    height: 48px;
  }

  .image-preview-overlay {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
    pointer-events: none;
    color: ${({ state }) => {
      switch (state) {
        case FILE_STATES.FINISHED:
          return '#369763';
        case FILE_STATES.ABORTED:
        case FILE_STATES.CANCELLED:
        case FILE_STATES.ERROR:
          return '#c44e47';
        default:
          return '#64605e';
      }
    }};
  }
`;

export default FilePondImagePreview;
