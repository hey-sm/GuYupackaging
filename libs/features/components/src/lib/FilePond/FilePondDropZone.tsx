import { asUploadButton } from '@rpldy/upload-button';
import UploadDropZone, { UploadDropZoneProps } from '@rpldy/upload-drop-zone';
import { forwardRef, useCallback } from 'react';
import styled from 'styled-components';

interface FilePondDropZoneProps {
  className?: string;
}

const DropZone = styled(UploadDropZone)`
  min-height: 4.75em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &.active {
    background-color: #dceaf4;
    border-color: #3278ff;
  }
`;

const DropZoneComponent = forwardRef<
  any,
  UploadDropZoneProps & { onClick?: (e: any) => void }
>((props, ref) => {
  const { onClick, ...buttonProps } = props;

  const onZoneClick = useCallback(
    (e: any) => {
      if (onClick) {
        onClick(e);
      }
    },
    [onClick]
  );

  return (
    <DropZone
      {...buttonProps}
      ref={ref}
      onDragOverClassName="active"
      extraProps={{ onClick: onZoneClick }}
    >
      <span>
        <a>点击上传</a>
        <span className="px-2">/</span>
        <span>拖拽到此区域</span>
      </span>
    </DropZone>
  );
});

const DropZoneButton = asUploadButton(DropZoneComponent);

export const FilePondDropZone = (props: FilePondDropZoneProps) => {
  return <DropZoneButton className="h-[144px]" />;
};

export default FilePondDropZone;
