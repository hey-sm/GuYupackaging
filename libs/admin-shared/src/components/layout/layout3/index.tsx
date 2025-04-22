import { Card } from 'antd';
import React from 'react';
import styled from 'styled-components';
import LayoutTable from '../layout1';

interface IProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  headerTitle?: React.ReactNode;
  /** 数据加载状态 */
  loading?: boolean;
  /** 重新加载回调 */
  reload?: () => void;
  /** 可改变列宽 */
  resize?: boolean;
  /** 是否筛选表格 */
  onFilter?: (v: Record<string, unknown>) => void;
  /** 可配置列 */
  setField?: boolean;
  /** 表格 */
  tableElement: JSX.Element;
  /** 树 */
  tree?: JSX.Element;
  toolBarRender?: () => React.ReactNode[];
}

const Layout3: React.FC<IProps> = ({
  tableElement,
  headerTitle,
  tree,
  resize,
  setField,
  loading = false,
  reload,
  onFilter,
  children,
  toolBarRender,
}) => {
  return (
    <Container className="page-container">
      {tree}
      <Card size="small" className="right">
        <LayoutTable
          headerTitle={headerTitle}
          tableElement={tableElement}
          reload={reload}
          onFilter={onFilter}
          resize={resize}
          setField={setField}
          loading={loading}
          toolBarRender={toolBarRender}
        >
          {children}
        </LayoutTable>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  display: flex;

  > .right {
    margin-left: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .ant-card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      .ka-wrapper {
        height: 100%;
      }
    }
  }
`;

export default React.memo(Layout3);
