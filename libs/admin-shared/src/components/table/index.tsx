import { Table as AntTable, TableProps } from 'antd';
import DraggableTable from './draggable-table';
import ResizeTable from './resize-table';

export { ResizeTable, DraggableTable };

export interface ITableProps<T extends object> extends TableProps<T> {
  resize?: boolean;
}

/** 根据resize判断使用ResizeTable或者AntTable */
function Table<T extends Record<string, unknown> = any>({
  resize,
  ...props
}: ITableProps<T> & {
  onColumnResize?: (column: any, columns: any[]) => void;
}): JSX.Element {
  return resize ? (
    <ResizeTable {...props} />
  ) : (
    // <Locale>
    <AntTable {...props} />
    // </Locale>
  );
}

export default Table;
