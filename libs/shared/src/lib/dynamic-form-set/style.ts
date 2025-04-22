import { Col, Drawer } from 'antd';
import styled from 'styled-components';
import ScrollWrapper from '../scroll-wrapper';

export const Wrapper = styled(Col)<{ height?: string; width?: string }>`
  .ant-form-item-label {
    width: 9em;
  }
  .ant-upload.ant-upload-select-picture-card {
    height: ${(props) => props.height ?? '104px'};
    width: ${(props) => props.width ?? '104px'};
  }
  div .datalist {
    color: red;
  }
  .row-selected td {
    background-color: ${(props) => props.theme['@primary-color']} !important;
    color: #fff !important;
  }
`;
export const DrawerWrapper = styled(Drawer)`
  .ant-form-item-label {
    width: 5em;
  }
`;
export const ScrollPanel = styled(ScrollWrapper)`
  height: 100%;
  .content {
    padding: 16px;
  }
`;
export const TableWapper = styled.div`
  .row-selected td {
    background-color: ${(props) => props.theme['@primary-color']} !important;
    color: #fff !important;
  }
`;
