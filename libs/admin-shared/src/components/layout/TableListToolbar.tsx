import { Space, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

export interface TableListToolbarProps {
  headerTitle?: React.ReactNode;
  toolBarRender?: () => React.ReactNode[];
}

const TableListToolbar = ({
  headerTitle,
  toolBarRender,
  children,
}: React.PropsWithChildren<TableListToolbarProps>) => {
  return (
    <Container>
      <div className="table-list-toolbar-left">
        <Typography.Text>{headerTitle}</Typography.Text>
      </div>

      <div className="flex justify-end p-2">
        <Space>
          {toolBarRender?.()}
          {children}
        </Space>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  .table-list-toolbar-setting-item {
    cursor: pointer;
  }
`;

export default TableListToolbar;
