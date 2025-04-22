import { Card } from 'antd';
import styled from 'styled-components';

export const CardWrapper = styled(Card)<{ width?: number }>`
  ${(props) => props.width && `width: ${props.width}px;`}

  display: flex;
  flex-direction: column;

  .ant-card-head {
    margin-bottom: 0;
  }

  .ant-card-body {
    flex: 1;
    padding: 0;
  }
`;

export const ContentWrapper = styled.div`
  padding: 12px;
  display: flex;
  min-height: 150px;
  > div.ant-space {
    flex: 1;
    display: flex;
    > div {
      width: 100%;
    }
  }

  .ant-tree-node-content-wrapper {
    white-space: nowrap;
  }
`;

export const Keywords = styled.span`
  color: ${(props) => props.theme['@error-color']};
`;
