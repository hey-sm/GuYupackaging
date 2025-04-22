// MessageBox 弹框
// 模拟系统的消息提示框而实现的一套模态对话框组件，用于消息提示、确认消息和提交内容。

// confirmButtonText 提示内容
import { Button, Modal, ModalProps } from 'antd';
import styled from 'styled-components';
import success from './iconImgs/success.png'; //成功
import warning from './iconImgs/warning.png'; //警告
import warningSuper from './iconImgs/warningSuper.png'; //失败

// enum typesmenu {
//   scuess = success,
//   error = '',
//   adjective = '',
// }

interface ModalPropsall extends ModalProps {
  title: string;
  isModalOpen?: boolean; //显示
  handleOk?: () => void; //确定函数ƒ
  handleCancel: () => void; //取消函数
  confirmButtonText?: string; //内容
  type?: string; //状态
  loading?: boolean;
  isCloseButton?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
}

export const MessageBox = (props: ModalPropsall) => {
  const {
    isModalOpen,
    handleOk,
    handleCancel,
    confirmButtonText,
    title,
    loading,
    cancelText,
    isCloseButton,
    onClose,
    onSubmit,
    type,
  } = props;

  return (
    <Modal
      title={
        <div className='flex'>
          <img
            alt=""
            width={21}
            className="mr-2"
            src={
              type === 'success'
                ? success
                : type === 'error'
                ? warningSuper
                : warning
            }
          />
              <span className="font16 tetx-[#000000] font-medium">{title}</span>
        </div>
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        isCloseButton ? (
          <div>
            <Button
              className="w-[76px] h-[32px] font14"
              onClick={() => {
                onClose && onClose();
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              loading={loading}
              className="w-[76px] h-[32px] font14"
              onClick={() => {
                onSubmit && onSubmit();
              }}
            >
              确认
            </Button>
          </div>
        ) : (
          <div className="modify industrial_right">
            <Button
              type="primary"
              className="w-[76px] h-[32px] font14"
              onClick={() => {
                onClose && onClose();
              }}
            >
              {cancelText}
            </Button>
          </div>
        )
      }
    >
      {confirmButtonText}
    </Modal>
  );
};


export const Container = styled(Modal)`
  .opt_text {
    color: var(--primary-color);
  }
  .modify {
    width: 100%;
    .confirm {
      width: 76px;
      height: 32px;
      font-size: 14px;
      color: #ffffff;
      background: var(--primary-color);
      cursor: pointer;
    }
    .cancel {
      width: 76px;
      height: 32px;
      background: #ffffff;
      font-size: 14px;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .content {
    font-size: 14px;
    line-height: 22px;
    font-weight: normal;
    color: rgba(0, 0, 0, 0.65);
  }
  .ant-modal-body {
    padding: 0 30px;
    box-sizing: border-box;
  }
  .ant-modal-header {
    border-color: transparent;
    padding-top: 32px;
    padding-left: 32px;
    padding-bottom: 15px;
    box-sizing: border-box;
  }
  .ant-modal-footer {
    border-color: transparent;
    padding-right: 21px;
    padding-bottom: 30px;
    box-sizing: border-box;
  }
`;
