import {
  Pagination,
  PaginationProps,
  Space,
  Table as TableAntd,
  TableProps as TableAntdProps,
} from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { Key, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useListContext } from '../context/ListContext';
import { RaRecord } from '../types';

export type DefaultColumn = {
  minWidth?: number; // 40
  maxWidth?: number; // 1000
  width?: number; // 180
};

const defaultColumn: DefaultColumn = {
  minWidth: 40,
  maxWidth: 1000,
  width: 180,
};

export type TableProps<RecordType extends object = any> = Omit<
  TableAntdProps<RecordType>,
  'dataSource' | 'loading'
> & {
  pagination?: Omit<
    PaginationProps,
    'hideOnSinglePage' | 'total' | 'showSizeChanger' | 'showQuickJumper'
  >;
} & {
  className?: string;
  actions?: ReactNode[] | false;
  bulkActionButtons?: ReactNode[] | false;
  selectedIds?: string[];
  data?: RecordType[];
  total?: PaginationProps['total'];
  isLoading?: boolean;
  setPage?: (page: number) => void;
  setPerPage?: (page: number) => void;
};

export const Table = <RecordType extends RaRecord = any>({
  actions = false,
  bulkActionButtons = false,
  pagination: paginationProps,
  rowKey = 'id',
  columns: columnsProp = [],
  ...tableProps
}: TableProps) => {
  const {
    data,
    isFetching,
    onSelect,
    onToggleItem,
    selectedIds,
    total,
    setPage,
    page,
    perPage,
  } = useListContext(tableProps);

  const lastSelected = useRef(null);

  useEffect(() => {
    if (!selectedIds || selectedIds.length === 0) {
      lastSelected.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedIds)]);

  const showTotal = useCallback((total: number, range: [number, number]) => {
    return `显示 ${range.join(' 到 ')}，共 ${total} 记录`;
  }, []);

  const hasBulkActions = useMemo(
    () => !!bulkActionButtons !== false,
    [bulkActionButtons]
  );

  const rowSelection: TableRowSelection<RecordType> | undefined =
    useMemo(() => {
      if (hasBulkActions) {
        const res = {
          fixed: true,
          columnWidth: 48,
          selectedRowKeys: selectedIds,
          onSelect: (record: any) => {
            onToggleItem(record.id as string);
          },
          onChange: (selectedRowKeys: Key[], selectedRows: RecordType[]) => {
            onSelect(selectedRowKeys as string[]);
          },
        };
        if (tableProps.rowSelection) {
          return Object.assign(tableProps.rowSelection);
        }
        return res;
      }
      return undefined;
    }, [
      hasBulkActions,
      onSelect,
      onToggleItem,
      selectedIds,
      tableProps.rowSelection,
    ]);

  const columns = useMemo(() => {
    return columnsProp.map((col) => {
      return Object.assign({}, { ...defaultColumn }, col);
    });
  }, [columnsProp]);

  return (
    <Container className="table">
      {(!!actions || !!bulkActionButtons) && (
        <Space className="bulk-action-buttons">
          {!!actions !== false && actions}
          {!!bulkActionButtons !== false && bulkActionButtons}
        </Space>
      )}

      <div className="table-content">
        <TableAntd
          className="no-stripe"
          scroll={{ x: '100%', y: '100%' }}
          rowKey={rowKey}
          rowSelection={rowSelection}
          loading={isFetching}
          dataSource={data}
          pagination={false}
          columns={columns}
          {...tableProps}
        />
      </div>

      {!!total && (
        <div className="pagination">
          <Pagination
            current={page}
            pageSize={perPage}
            total={total}
            showSizeChanger
            showQuickJumper
            showTotal={showTotal}
            onChange={setPage}
            {...paginationProps}
          />
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .bulk-action-buttons,
  .table-content {
    padding: 0 20px;
    margin-top: 20px;
  }

  .table-content {
    flex: 1;
    height: 100%;
    min-height: 0;
  }

  .ant-table-wrapper {
    height: 100%;
    min-height: 0;
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
            .ant-table-body {
              flex: 1;
            }
          }
        }
      }
    }
  }

  .pagination {
    padding: 20px;
    box-shadow: 0px -2px 4px -3px rgba(0, 0, 0, 0.12);
    position: relative;
    z-index: 10;

    .ant-pagination {
      display: flex;
      .ant-pagination-total-text {
        flex: 1;
      }
    }

    .ant-pagination-item,
    .ant-pagination-item-link {
      border: none;
      height: 30px;
      background-color: #f5f6f7;
      border-radius: 4px;
      a {
        color: #bbbdbf;
        &:hover {
          color: rgb(var(--color-primary));
        }
      }
    }

    .ant-pagination-item-active {
      background-color: #e8f4ff;
      a {
        color: rgb(var(--color-primary));
      }
    }
  }
`;

export default Table;
