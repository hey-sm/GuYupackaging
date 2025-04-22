import { MenuFoldOne, MenuUnfoldOne } from '@icon-park/react';
import { Tooltip } from 'antd';
import { createElement, FC } from 'react';
import styled from 'styled-components';
import { useSidebarState } from './useSidebarState';

export type SidebarToggleButtonProps = {
  className?: string;
};

export const SidebarToggleButton: FC<SidebarToggleButtonProps> = (props) => {
  const { className } = props;

  const [open, setOpen] = useSidebarState();

  return (
    <Container
      className={className}
      placement="right"
      title={open ? '关闭菜单' : '打开菜单'}
      showArrow={false}
    >
      <a onClick={() => setOpen(!open)}>
        {createElement(open ? MenuUnfoldOne : MenuFoldOne, {
          size: 28,
          fill: '#4E5969',
        })}
      </a>
    </Container>
  );
};

const Container = styled(Tooltip)`
  span.i-icon {
    display: flex;
  }

  a {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default SidebarToggleButton;
