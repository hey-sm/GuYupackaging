import { TableRowSelection } from 'antd/lib/table/interface';
import { useState, useMemo, Key } from 'react';

export const useTableRowSelection = <T,>({
  rowKey = 'id',
}: {
  rowKey?: string;
} = {}) => {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const selectedRowKeys = useMemo(
    () => selectedRows.map((v: any) => v[rowKey]),
    [rowKey, selectedRows]
  );
  const rowSelection: TableRowSelection<T> = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (_selectedRowKeys: Key[], selectedRows) => {
        setSelectedRows(selectedRows);
      },
    }),
    [selectedRowKeys]
  );

  return {
    rowSelection,
    selectedRows,
    setSelectedRows,
    selectedRowKeys,
  };
};
