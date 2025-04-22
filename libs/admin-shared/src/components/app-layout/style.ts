import { Layout } from 'antd';
import styled from 'styled-components';

export const SpinWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/** header */
export const HeaderWrapper = styled(Layout.Header)`
  height: 48px;
  line-height: 48px;
  padding-left: 0;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  background-color: #fff !important;
  display: flex;
  position: relative;
  z-index: 2;
  .header-info {
    flex: 1;
    .trigger {
      font-size: 18px;
      line-height: 48px;
      padding: 0 24px;
      transition: color 0.3s;
      cursor: pointer;
    }
  }
  .header-actions {
    display: flex;
    align-items: center;
    > .ant-space-item > * {
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:not(:last-child) {
        margin-right: 8px;
      }
    }
  }
`;

/** sider menu */
export const SiderWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  .logo {
    position: relative;
    z-index: 1;
    display: flex;
    padding: 16px 20px;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    > img {
      width: 190px;
      height: 40px;
      /* transition: all 0.3s; */
    }
    &.mini > img {
      width: 48px;
    }
  }
  .menu-wrapper {
    flex: 1;
    padding: 10px 0;
  }
  .ant-menu-inline {
    border-right: 0;
  }

  .fade-enter {
    opacity: 0;
    transform: scale(0.7);
  }
  .fade-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transform: scale(0.1);
    transition: opacity 300ms, transform 300ms;
  }
`;
