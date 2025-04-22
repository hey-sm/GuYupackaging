import styled from 'styled-components';
import ScrollWrapper from '../../scroll-wrapper';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  .table-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100% - 64px);
  }

  .ant-table-cell.nobg {
    background-color: transparent !important;
  }
`;

export const ContentWrapper = styled(ScrollWrapper)<{
  showShadowRight?: boolean;
}>`
  height: 100%;
`;

export const SetTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
`;

export const TreeWrapper = styled.div`
  .ant-tree-switcher {
    display: none;
  }
`;

export const TableFooter = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;

  .layout-pagination {
    display: flex;
    justify-content: flex-end;
  }
`;

export const TableContent = styled.div`
  flex: 1;
  overflow: hidden;

  .ant-form {
    height: 100%;
    .ant-table-wrapper {
      height: 100%;
      .ant-spin-nested-loading {
        height: 100%;
        .ant-spin-container {
          height: 100%;
          .ant-table {
            height: 100%;
            .ant-table-container {
              height: 100%;
              display: flex;
              flex-direction: column;
              overflow: visible;

              .ant-table-body {
                flex: 1 1 0;
                max-height: none !important;
                overflow: auto scroll !important;
              }
            }
          }
        }
      }
    }
  }
`;
