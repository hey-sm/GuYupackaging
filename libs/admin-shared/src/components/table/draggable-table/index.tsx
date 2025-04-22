// import { Locale } from '../..'
import { DragOutlined } from '@ant-design/icons';
import { Table, TableProps } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import { isEqual } from 'lodash-es';

import React, { useMemo, useState, useEffect } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => (
  <DragOutlined style={{ cursor: 'grab', color: '#999' }} />
));
const SortableItem = SortableElement((props: any) => <tr {...props} />);
const SortableWrapper = SortableContainer((props: any) => <tbody {...props} />);

interface IDraggableTableProps<RecordType extends Record<string, unknown> = any>
  extends TableProps<RecordType> {
  /** 主键字段名称 */
  primaryKey: string;
  onSort?: (list: Array<RecordType>) => void;
}

/** 拖拽排序表格 */
const DraggableTable: React.FC<IDraggableTableProps> = ({
  primaryKey,
  dataSource = [],
  onSort,
  children,
  ...props
}: any) => {
  const columnData = useMemo(() => dataSource, [dataSource]);
  const [columnList, setColumnList] = useState([]);

  useEffect(() => {
    if (props.columns) {
      setColumnList(props.columns);
    } else {
      const cols = (children as any[]).map((v) => ({ ...v.props })) as any;
      setColumnList(cols);
    }
  }, [children, props.columns]);

  const onSortEnd = React.useCallback(
    ({ oldIndex, newIndex }: any) => {
      if (oldIndex !== newIndex) {
        const list = arrayMoveImmutable(
          [].concat(columnData),
          oldIndex,
          newIndex
        ).filter((el) => !!el);
        if (onSort) onSort(list);
      }
    },
    [columnData, onSort]
  );

  const DraggableContainer = React.useMemo(
    () => (resetProps: any) =>
      (
        <SortableWrapper
          useDragHandle
          disableAutoscroll
          helperClass="row-dragging"
          onSortEnd={onSortEnd}
          {...resetProps}
        />
      ),
    [onSortEnd]
  );
  const DraggableBodyRow = React.useMemo(
    () =>
      ({ className, style, ...restProps }: any) => {
        const index = columnData.findIndex(
          (x: any) => x[primaryKey] === restProps['data-row-key']
        );
        return <SortableItem index={index} {...restProps} />;
      },
    [columnData, primaryKey]
  );

  const columns = React.useMemo(() => {
    let w = 62;
    if (props.size === 'small' || props.size === 'middle') w = 50;
    return [
      {
        title: '排序',
        align: 'center',
        width: w,
        shouldCellUpdate: (curr: any, prev: any) => !isEqual(curr, prev),
        render: () => <DragHandle />,
      },
      ...columnList,
    ];
  }, [columnList, props.size]);

  return (
    // <Locale>
    <Table
      {...props}
      columns={columns as any}
      dataSource={columnData}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
    // </Locale>
  );
};

export default DraggableTable;
