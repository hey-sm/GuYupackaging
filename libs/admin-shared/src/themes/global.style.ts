import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`


  html,
  body {
    padding: 0;
    margin: 0;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  @media print {
    margin: 0;
    body {
      padding: 10mm;
    }
  }

  .app-layout-tabs {
    height: 50px;
    overflow: visible;
  }

  .ant-cascader-menu {
    height: 280px;
  }

  .page-container {
    > .ant-card.right {
      width: 0;
    }
  }

  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    color: rgba(87, 125, 244, 1) !important;
    background-color: rgba(238, 242, 253, 1) !important;

    .ant-typography {
      color: rgba(87, 125, 244, 1);
    }
  }

  /* 拖动表格 */
  .row-dragging {
    background: #fafafa;
    border: 1px solid #ccc;
    z-index: 1001;
    td {
      padding: 16px;
    }
    .drag-visible {
      visibility: visible;
    }
  }



  .ant-table-wrapper {
    th.react-resizable:last-child {
      .react-resizable-handle {
        right: 0;
      }
    }
  }

  .goods-model {
    .active-row {
      cursor: pointer;
      background-color: #577df4;
    }
  }

  .goods-picker-modal-wrap.ant-modal-wrap {
    overflow: hidden;
  }
`;

export default GlobalStyle;
