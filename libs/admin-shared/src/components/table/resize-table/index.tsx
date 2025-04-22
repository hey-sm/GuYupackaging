import { Table, TableProps } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { defaultsDeep } from 'lodash-es';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import styled from 'styled-components';

const ResizableTitle = (
  props: React.HTMLAttributes<any> & {
    onResize: (
      e: React.SyntheticEvent<Element>,
      data: ResizeCallbackData
    ) => void;
    width: number;
  }
) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

declare type ResizeTableType<T extends Record<string, unknown> = any> =
  React.FC<
    TableProps<T> & { onColumnResize?: (column: any, columns: any[]) => void }
  >;

/** 可变列宽表格 */
const ResizeTable: ResizeTableType = ({ children, ...props }) => {
  const components = React.useMemo(
    () =>
      defaultsDeep(props.components || {}, {
        header: { cell: ResizableTitle },
      }),
    [props.components]
  );

  const [columns, setColumns] = React.useState<any[]>([]);

  useEffect(() => {
    if (props.columns) {
      setColumns(props.columns);
    } else {
      const cols = (children as any[]).map((v) => ({ ...v.props }));
      setColumns(cols);
    }
  }, [children, props.columns]);

  const handleResize = useCallback(
    (index: number) =>
      (_: React.SyntheticEvent<Element>, { size }: ResizeCallbackData) => {
        const newColumns = [...columns];

        newColumns[index] = {
          ...newColumns[index],
          width: size.width,
        };

        props.onColumnResize?.(newColumns[index], newColumns);

        setColumns(newColumns);
      },
    [columns, props]
  );

  const mergeColumns = useMemo(
    () =>
      columns.map((col: any, index) => ({
        ...col,
        onHeaderCell: (column: any) => ({
          width: (column as ColumnType<any>).width,
          onResize: handleResize(index),
        }),
      })),
    [columns, handleResize]
  );

  return (
    <Container {...props} components={components} columns={mergeColumns}>
      {children}
    </Container>
  );
};

const Container = styled(Table)`
  .react-resizable {
    position: relative;
    background-clip: padding-box;
  }

  .react-resizable-handle {
    position: absolute;
    right: -5px;
    bottom: 0;
    z-index: 1;
    width: 10px;
    height: 100%;
    cursor: col-resize;
  }
`;

export default ResizeTable;
