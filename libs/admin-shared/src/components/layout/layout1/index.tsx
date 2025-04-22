import {
  ReloadOutlined,
  SettingOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Button, Form, Pagination, Popover, Space, Tooltip, Tree } from 'antd';

import { cloneDeep, debounce } from 'lodash-es';
import React, { useCallback, useRef, useState } from 'react';
import { SpringSystem, Spring } from 'rebound';
import ResizeTable from '../../table';
import Density from '../Density';
import TableListToolbar from '../TableListToolbar';
import { Wrapper, TableFooter, TableContent } from './style';

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
  /** 条纹表格 */
  tableStriped?: boolean;
  /**
   * 列设置改变
   */
  onColumnSettingsChange?: (columns: any[]) => void;
  toolBarRender?: () => React.ReactNode[];
}

/** 列表页面统一Table父组件 */
export const LayoutTable: React.FC<IProps> = ({
  tableElement,
  headerTitle,
  resize,
  setField,
  tableStriped,
  loading = false,
  reload,
  onFilter,
  children,
  onColumnSettingsChange,
  toolBarRender,
  ...props
}) => {
  const [size, setSize] = useState<string>('small');

  const [filterForm] = Form.useForm();

  const tableContentRef = useRef<HTMLDivElement>(null);
  const springRef = React.useRef<Spring>();
  const scrollRef = React.useRef<HTMLDivElement | null>();
  const [scroll, setScrollState] = React.useState(0);

  /** columns数据源 */
  const [columns, setColumns] = React.useState<any[]>([]);

  React.useEffect(() => {
    scrollRef.current =
      tableContentRef.current?.querySelector('div.ant-table-body');
    scrollRef.current?.addEventListener('scroll', handleOnScroll);

    const springSystem = new SpringSystem();
    springRef.current = springSystem.createSpring(50, 10);
    springRef.current.addListener({ onSpringUpdate: handleSpringUpdate });

    return () => {
      if (springRef.current) springSystem.deregisterSpring(springRef.current);
      springSystem.removeAllListeners();
      springRef.current?.destroy();
      scrollRef.current?.removeEventListener('scroll', handleOnScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const columns = tableElement.props.columns ?? [];
    const cols =
      columns ||
      (tableElement.props.children as JSX.Element[]).map((v) => ({
        ...v.props,
      }));

    const newlist = cols.map((v: any, i: number) => ({
      ...v,
      key: `drop-coloum-${i}`,
      isShow: true,
    }));
    setColumns(newlist);
  }, [tableElement.props.columns, tableElement.props.children]);

  const fieldList = React.useMemo(
    () =>
      columns
        .filter((v: any) => !!v.title)
        .map((v: any) => ({ key: v.key, title: v.title, isLeaf: true })),
    [columns]
  );
  const checkedKeys = React.useMemo<string[]>(
    () => columns.filter((v) => v.isShow).map((v) => v.key),
    [columns]
  );
  const tableColumns = React.useMemo(() => {
    const cols = cloneDeep(columns).filter((v) => v.isShow);
    cols.forEach((v) => {
      if (v.dataIndex === 'index') v.width = 60;
      delete v.isShow;
    });
    return cols;
  }, [columns]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOnScroll = useCallback(
    debounce((e: any) => {
      setScrollState(e?.target?.scrollTop || 0);
    }, 300),
    []
  );

  const handleSpringUpdate = React.useCallback((spring: Spring) => {
    const val = spring.getCurrentValue();
    scrollRef.current?.scroll({ top: val });
  }, []);

  const handleScrollTop = React.useCallback(() => {
    const scrollTop = scrollRef.current?.scrollTop || 0;
    springRef.current?.setCurrentValue(scrollTop)?.setAtRest();
    springRef.current?.setEndValue(0);
  }, []);

  /** 拖动字段排序 */
  const handleDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: any, key: string, callback: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = cloneDeep(columns);

    let dragObj: any;
    loop(data, dragKey, (item: any, index: any, arr: any) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    let ar: any;
    let i = 0;
    loop(data, dropKey, (_item: any, index: number, arr: any) => {
      ar = arr;
      i = index;
    });
    ar.splice(dropPosition === -1 ? i : i + 1, 0, dragObj);
    setColumns(data);
    onColumnSettingsChange?.(data);
  };

  /** 隐藏/显示字段 */
  const handleCheck = (_keys: any, { checked, node }: any) => {
    const cols = cloneDeep(columns);
    const col = cols.find((v) => v.key === node.key);
    col.isShow = checked;
    setColumns(cols);
    onColumnSettingsChange?.(cols);
  };

  // 分页相关
  const pagination = React.useMemo(
    () => tableElement?.props?.pagination,
    [tableElement.props.pagination]
  );
  const tableProps = React.useMemo(
    () => ({ ...tableElement?.props, children: undefined, pagination: false }),
    [tableElement.props]
  );

  return (
    <>
      <Wrapper {...props} className="page-container">
        <TableListToolbar
          headerTitle={headerTitle}
          toolBarRender={toolBarRender}
        >
          <Space className="table-list-toolbar-setting-items" size={16}>
            <div
              className="table-list-toolbar-setting-item"
              onClick={() => reload?.()}
            >
              <Tooltip placement="top" title="刷新">
                <ReloadOutlined />
              </Tooltip>
            </div>

            <Density value={size} onChange={setSize} />

            <div className="table-list-toolbar-setting-item">
              <Tooltip placement="top" title="列设置">
                <Popover
                  placement="bottomRight"
                  content={
                    <Tree
                      treeData={fieldList}
                      checkedKeys={checkedKeys}
                      onDrop={handleDrop}
                      onCheck={handleCheck}
                      draggable
                      blockNode
                      checkable
                      selectable={false}
                    />
                  }
                  trigger="click"
                >
                  <SettingOutlined />
                </Popover>
              </Tooltip>
            </div>
          </Space>
        </TableListToolbar>
        <div className="table-content">
          <TableContent className="sc-table-warpper" ref={tableContentRef}>
            <Form form={filterForm}>
              <ResizeTable
                loading={loading}
                resize={resize}
                {...tableProps}
                size={size}
                columns={tableColumns}
                scroll={{ x: 0, y: 0, scrollToFirstRowOnChange: true }}
                key="layout1-table"
              />
            </Form>
          </TableContent>
          {pagination && (
            <TableFooter>
              <Space>
                {scroll > 0 && (
                  <Button
                    size="small"
                    icon={<VerticalAlignTopOutlined />}
                    children="返回顶部"
                    onClick={handleScrollTop}
                  />
                )}
              </Space>
              <Pagination
                {...pagination}
                size="small"
                className="layout-pagination"
              />
            </TableFooter>
          )}
        </div>
      </Wrapper>
      {children}
    </>
  );
};

export default LayoutTable;
