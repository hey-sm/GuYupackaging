import { Down } from '@icon-park/react';
import { Avatar, Dropdown, DropDownProps } from 'antd';
import { motion } from 'framer-motion';
import { FC, useMemo, useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { useGetIdentity, useLogout } from '../../auth';
import { UserIdentity } from '../../types';

const variants = {
  open: { transform: `rotateX(0)` },
  closed: { transform: `rotateX(180deg)` },
};

export type UserMenuProps = {
  menu?: DropDownProps['menu'];
};

export const UserMenu: FC<UserMenuProps> = (props) => {
  const { menu: menuProp } = props;
  const { isLoading, data } = useGetIdentity<UserIdentity>();

  const logoutMutation = useLogout();

  const [open, setOpen] = useState(false);

  const menu = useMemo(() => {
    if (menuProp) return menuProp;
    return {
      items: [
        {
          key: 'logout',
          label: <span>退出登录</span>,
          onClick: () => {
            logoutMutation.mutate();
          },
        },
      ],
    };
  }, [logoutMutation, menuProp]);

  return (
    <Container>
      {!isLoading && data?.fullName && (
        <div className="user-menu">
          <Avatar src={data?.avatar} size={32} />
          <StyledDropdown
            onOpenChange={setOpen}
            overlayClassName="user-menu-dropdown"
            menu={menu}
            trigger={['click']}
          >
            <a className="full-name">
              <span>{data?.fullName}</span>
              <div className="arrow">
                <motion.div
                  animate={open ? 'open' : 'closed'}
                  variants={variants}
                >
                  <Down />
                </motion.div>
              </div>
            </a>
          </StyledDropdown>
          <GlobalStyle />
        </div>
      )}
    </Container>
  );
};

const GlobalStyle = createGlobalStyle`${css`
  .user-menu-dropdown {
    .ant-dropdown-menu {
      box-shadow: 2px 2px 8px 0px rgba(82, 90, 102, 0.08),
        1px 1px 2px 0px rgba(82, 90, 102, 0.04);
      border-radius: 8px;
      padding: 4px;

      .ant-dropdown-menu-item {
        padding: 14px 16px;
        border-radius: 6px;
        font-size: 12px;
        line-height: 12px;
        color: #1d2129;
        &:hover {
          color: #0081ff;
          background: #e8f4ff;
        }
      }
    }
  }
`}
`;

const Container = styled.div`
  display: flex;
  align-items: center;

  .user-menu {
    display: flex;
  }

  .full-name {
    font-size: 14px;
    line-height: 14px;
    color: #1d2129;
    margin-left: 8px;
    display: flex;
    align-items: center;
  }

  .arrow {
    width: 16px;
    height: 16px;
    background: #f7f8f7;
    border-radius: 4px 4px 4px 4px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    span.i-icon {
      display: flex;
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
`;

const StyledDropdown = styled(Dropdown)`
  .ant-dropdown-menu {
    box-shadow: 2px 2px 8px 0px rgba(82, 90, 102, 0.08),
      1px 1px 2px 0px rgba(82, 90, 102, 0.04);
    border-radius: 8px;
  }
`;

export default UserMenu;
