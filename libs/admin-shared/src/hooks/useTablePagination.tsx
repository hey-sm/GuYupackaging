import { TablePaginationConfig } from 'antd';
import { useMemo } from 'react';

export const useTablePagination = ({
  current,
  pageSize,
  total,
  onChange,
}: {
  current?: number;
  total?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
}) => {
  const pagination = useMemo<TablePaginationConfig>(() => {
    return {
      current: current ?? 1,
      pageSize: pageSize ?? 10,
      total: total ?? 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条数据`,
      onChange,
    };
  }, [current, onChange, pageSize, total]);
  return pagination;
};
