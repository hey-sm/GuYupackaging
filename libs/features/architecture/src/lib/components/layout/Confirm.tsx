import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal, ModalProps } from 'antd';
import { ReactNode } from 'react';

export type ConfirmProps = Omit<ModalProps, 'onOk' | 'onCancel'> & {
  loading?: boolean;
  content?: ReactNode;
  onConfirm?: () => void;
  onClose?: () => void;
};

export const Confirm = (props: ConfirmProps) => {
  const { open, loading, title, content, onConfirm, onClose } = props;
  return (
    <Modal
      key="modal"
      wrapClassName="ant-modal-confirm ant-modal-confirm-confirm"
      closable={false}
      open={open}
      footer={null}
      destroyOnClose
      maskClosable={false}
    >
      <div className="ant-modal-confirm-body-wrapper">
        <div className="ant-modal-confirm-body">
          <InfoCircleOutlined />
          <span className="ant-modal-confirm-title">{title}</span>
          <div className="ant-modal-confirm-content">{content}</div>
        </div>
        <div className="ant-modal-confirm-btns">
          <Button onClick={onClose}>取 消</Button>
          <Button type="primary" onClick={onConfirm} loading={loading}>
            确 认
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Confirm;
