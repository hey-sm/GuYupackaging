import { Close } from '@icon-park/react';
import { Modal } from 'antd';
import styled from 'styled-components';

export type ModalVideoProps = {
  title?: string;
  url: string;
  open?: boolean;
  onClose?: () => void;
};

export const ModalVideo = (props: ModalVideoProps) => {
  const { url, open = false, onClose } = props;
  return (
    <StyledModal
      width={800}
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={
        <Close theme="outline" size="24" fill="#fff" className="flex" />
      }
      maskClosable
      destroyOnClose
    >
      <video
        className="w-full aspect-video"
        src={url}
        autoPlay={open}
        controls
      />
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-close {
    right: -32px;
    .ant-modal-close-x {
      width: auto;
      height: auto;
    }
  }
`;
