import { Layout } from 'antd';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import UserMenu from './UserMenu';

export type AppBarProps = {
  className?: string;
  children?: ReactNode;
  userMenu?: JSX.Element | boolean;
};

const DefaultUserMenu = <UserMenu />;

export const AppBar: FC<AppBarProps> = (props) => {
  const { children, className, userMenu = DefaultUserMenu } = props;
  return (
    <Root className={className}>
      <div>{children}</div>
      {userMenu}
    </Root>
  );
};

export const Root = styled(Layout.Header)`
  height: 60px;
  padding: 0 18px;
  background: #ffffff;
  box-shadow: 2px 2px 8px 0px rgba(82, 90, 102, 0.08),
    1px 1px 2px 0px rgba(82, 90, 102, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;
`;

export default AppBar;
