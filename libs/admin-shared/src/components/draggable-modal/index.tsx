/* eslint-disable no-unsafe-optional-chaining */
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Modal, ModalProps } from 'antd';
import React from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import styled, { css } from 'styled-components';
import ScrollWrapper from '../scroll-wrapper';

const ModalWrapper = styled(Modal)<{ fullScreen?: boolean }>`
  padding: 0 !important;
  transition: all 0.2s ease-out;
  transition-property: width, height, top, left;
  ${(props) =>
    props.fullScreen &&
    css`
      width: 100vw !important;
      max-width: 100vw !important;
      margin: 0 !important;
      top: 0;
      .ant-modal-content {
        height: 100vh;
        display: flex;
        flex-direction: column;
        .ant-modal-body {
          flex: 1;
        }
      }
      .react-draggable {
        transform: translate(0, 0) !important;
      }
    `}
`;

const DarggableTitle = styled.div`
  width: 100%;
  cursor: move;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 60px;
  height: 56px;
  display: flex;
  align-items: center;

  button {
    background: transparent !important;
    transition: color 0.3s;
    color: rgba(0, 0, 0, 0.45) !important;
    &:hover {
      color: rgba(0, 0, 0, 0.75) !important;
    }
  }
`;

const ModalScrollBody = styled(ScrollWrapper)<{
  fullScreen: boolean;
  height: number;
}>`
  height: ${(props) => (props.fullScreen ? '100%' : `${props.height}px`)};
`;

interface DraggableModalProps extends ModalProps {
  autoFullScreen?: boolean;
  showFullScreen?: boolean;
  scroll?: boolean;
  height?: number;
  onChangeFullScreen?: (fullScreen: boolean) => void;
}

/** 扩展antd Modal，可拖动 */
const DraggableModal: React.FC<DraggableModalProps> = ({
  autoFullScreen = false,
  height = 200,
  showFullScreen = true,
  scroll = true,
  title,
  onChangeFullScreen,
  children,
  ...props
}) => {
  /** ref引用 */
  const draggleRef = React.useRef<HTMLDivElement>(null);
  /** 边界 */
  const [bounds, setBounds] = React.useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [disabled, setDisabled] = React.useState(true);
  const [fullScreen, setFullScreen] = React.useState(autoFullScreen);

  React.useEffect(() => {
    onChangeFullScreen?.(fullScreen);
  }, [fullScreen]);

  /** draggable start event */
  const onStart: DraggableEventHandler = React.useCallback((_event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect() as any;
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  }, []);

  const childContent = React.useMemo(
    () =>
      scroll ? (
        <ModalScrollBody fullScreen={fullScreen} height={height}>
          {children}
        </ModalScrollBody>
      ) : (
        children
      ),
    [children, fullScreen, scroll]
  );

  return (
    // <Locale>
    <ModalWrapper
      title={
        <React.Fragment>
          {fullScreen && title}
          {!fullScreen && (
            <DarggableTitle
              onMouseOver={() => disabled && setDisabled(false)}
              onMouseOut={() => setDisabled(true)}
            >
              {title}
            </DarggableTitle>
          )}
          {showFullScreen && (
            <ButtonWrapper className="actions">
              <Button
                type="text"
                icon={
                  fullScreen ? (
                    <FullscreenExitOutlined />
                  ) : (
                    <FullscreenOutlined />
                  )
                }
                onClick={() => setFullScreen((v) => !v)}
              />
            </ButtonWrapper>
          )}
        </React.Fragment>
      }
      {...props}
      fullScreen={fullScreen}
      modalRender={(modal) => (
        <Draggable disabled={disabled} bounds={bounds} onStart={onStart}>
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      {childContent}
    </ModalWrapper>
    // </Locale>
  );
};

export default DraggableModal;
