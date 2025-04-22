import {
  ReloadOutlined,
  SettingOutlined,
  FilterOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Pagination,
  Popover,
  Space,
  Tabs,
  Tree,
} from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { cloneDeep, debounce, defaultsDeep } from 'lodash-es';

import React, { useCallback, useMemo, useRef } from 'react';
import { SpringSystem, Spring } from 'rebound';
import CusIcon from '../../app-icons';
import ResizeTable from '../../table';
import { ListToolBarProps } from '../types';
import {
  Wrapper,
  TreeWrapper,
  ContentWrapper,
  TableFooter,
  TableContent,
} from './style';

interface BoxTableProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  headerTitle?: string;
  /** 数据加载状态 */
  loading?: boolean;
  /** 重新加载回调 */
  onReload?: () => void;
  /** 可改变列宽 */
  resize?: boolean;
  /** 是否筛选表格 */
  onFilter?: (v: Record<string, unknown>) => void;
  /** 可配置列 */
  setField?: boolean;
  /** 表格 */
  tableElement: JSX.Element;
  /** 明细表 */
  editElement?: React.ReactNode;
  tabKey?: LayoutTab;
  changeTab?: (tabKey: LayoutTab) => void;
  /**
   * 列设置改变
   */
  onColumnSettingsChange?: (columns: any[]) => void;
  destroyInactiveTabPane?: boolean;
  onColumnResize?: (column: any, columns: any[]) => void;

  toolBarRender?: (action: React.ReactNode) => React.ReactNode[] | boolean;
  toolBar?: ListToolBarProps;
}

export declare type LayoutTab = 'main' | 'detail';

/** 列表页面统一Table父组件 */
const Layout2Table: React.FC<BoxTableProps> = ({
  headerTitle,
  tableElement,
  editElement,
  resize,
  setField,
  children,
  tabKey = 'main',
  loading = false,
  onReload,
  changeTab,
  onFilter,
  onColumnSettingsChange,
  destroyInactiveTabPane = true,
  toolBarRender,
  toolBar,
  ...props
}) => {
  const [size, setSize] = React.useState<SizeType>('small');
  const [showField, setShowField] = React.useState(false);
  const [filterForm] = Form.useForm();
  const [showFilter, setShowFilter] = React.useState(false);

  const tableContentRef = useRef<HTMLDivElement>(null);
  const springRef = React.useRef<Spring>();
  const scrollRef = React.useRef<HTMLDivElement | null>();
  const [scroll, setScrollState] = React.useState(0);

  const handleRefresh = React.useCallback(() => {
    if (onReload) onReload();
  }, [onReload]);

  /** columns数据源 */
  const [columns, setColumns] = React.useState<any[]>([]);
  const [components, setComponents] = React.useState({});

  React.useEffect(() => {
    scrollRef.current =
      tableContentRef.current?.querySelector('div.ant-table-body');
    scrollRef.current?.addEventListener('scroll', handleOnScroll);

    setComponents(tableElement.props.components || {});

    const springSystem = new SpringSystem();
    springRef.current = springSystem.createSpring(50, 10);
    springRef.current.addListener({ onSpringUpdate: handleSpringUpdate });

    return () => {
      if (springRef.current) springSystem.deregisterSpring(springRef.current);
      springSystem.removeAllListeners();
      springRef.current?.destroy();
      scrollRef.current?.removeEventListener('scroll', handleOnScroll);
    };
  }, []);

  React.useEffect(() => {
    const table = tableElement as JSX.Element;
    const cols =
      table.props.columns ||
      (table.props.children as JSX.Element[]).map((v) => ({ ...v.props }));

    const result = cols.map((v: any, i: number) => ({
      ...v,
      key: `drop-column-${i}`,
    }));

    setColumns(result);
  }, [tableElement.props.columns, tableElement.props.children]);

  const fieldList = React.useMemo(
    () =>
      columns
        .filter((v) => !!v.title)
        .map((v) => ({ key: v.key, title: v.title, isLeaf: true })),
    [columns]
  );

  const checkedKeys = React.useMemo<string[]>(
    () => columns.filter((v) => v.isShow).map((v) => v.key),
    [columns]
  );

  const tableColumns = React.useMemo(() => {
    const cols = cloneDeep(columns).filter((v) => !!v.isShow);

    cols.forEach((v) => {
      if (v.dataIndex === 'index') v.width = 60;
      delete v.isShow;
    });

    return cols;
  }, [columns]);

  const handleOnScroll = useCallback(
    debounce((e: any) => {
      setScrollState(e?.target?.scrollTop || 0);
    }, 300),
    []
  );

  const handleSpringUpdate = React.useCallback((spring: Spring) => {
    const val = spring.getCurrentValue();
    scrollRef.current?.scrollTo({ top: val });
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

  /** 是否显示列表 */
  const isOnTable = React.useMemo(() => tabKey === 'main', [tabKey]);
  /** 切换表格大小菜单 */
  const sizeMenus = React.useMemo(
    () => (
      <Menu selectedKeys={size ? [size] : undefined}>
        <Menu.Item
          key="default"
          onClick={() => setSize('large')}
          children="较大"
        />
        <Menu.Item
          key="middle"
          onClick={() => setSize('middle')}
          children="中等"
        />
        <Menu.Item
          key="small"
          onClick={() => setSize('small')}
          children="紧凑"
        />
      </Menu>
    ),
    [size]
  );

  /** 筛选内容改变事件 */
  const handleChangeFilter = React.useCallback(
    debounce(() => {
      const data = filterForm.getFieldsValue();
      if (onFilter) onFilter(data);
    }, 300),
    [filterForm, onFilter]
  );

  /** 显示/取消 筛选 */
  const handleChangeShowFilter = () => {
    setShowFilter((v) => {
      if (v) {
        filterForm.resetFields();
        const data = filterForm.getFieldsValue();
        if (onFilter) onFilter(data);
      }
      return !v;
    });
  };

  const tableComponents = React.useMemo(
    () =>
      defaultsDeep(cloneDeep(components), {
        header: {
          row: (restProps: any) => (
            <React.Fragment>
              <tr>
                <th className="ant-table-cell nobg"></th>
                {tableColumns.map((v, i) => (
                  <th className="ant-table-cell nobg" key={`search-td-${i}`}>
                    {v.dataIndex &&
                      v.dataIndex !== 'index' &&
                      v.dataIndex !== 'operate' && (
                        <Form.Item name={v.dataIndex} style={{ margin: 0 }}>
                          <Input
                            placeholder="请输入"
                            onChange={handleChangeFilter}
                            allowClear
                          />
                        </Form.Item>
                      )}
                  </th>
                ))}
              </tr>
              <tr {...restProps} />
            </React.Fragment>
          ),
        },
      }),
    [tableColumns, components]
  );

  // 分页相关
  const pagination = React.useMemo(
    () => tableElement?.props?.pagination,
    [tableElement.props.pagination]
  );
  const tableProps = React.useMemo(
    () => ({ ...tableElement?.props, pagination: false }),
    [tableElement.props]
  );

  const action = useMemo(
    () => (
      <Space wrap>
        {toolBar?.actions}

        {!!onReload && (
          <Button
            icon={<ReloadOutlined />}
            children="刷新表格"
            disabled={!isOnTable}
            onClick={handleRefresh}
          />
        )}
        <Dropdown
          overlay={sizeMenus}
          trigger={['click']}
          disabled={!isOnTable}
          arrow
        >
          <Button icon={<CusIcon type="line-height" />} children="表格大小" />
        </Dropdown>

        {setField && (
          <Popover
            placement="bottomRight"
            title="列展示(拖动排序)"
            content={
              <TreeWrapper>
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
              </TreeWrapper>
            }
            trigger="click"
            visible={isOnTable && showField}
            onVisibleChange={setShowField}
          >
            <Button
              icon={<SettingOutlined />}
              children="列设置"
              disabled={!isOnTable}
            />
          </Popover>
        )}

        {!!onFilter && (
          <Button
            icon={<FilterOutlined />}
            children={!showFilter ? '筛选表格' : '取消筛选'}
            disabled={!isOnTable}
            onClick={handleChangeShowFilter}
          />
        )}
      </Space>
    ),
    [
      toolBar,
      onReload,
      isOnTable,
      handleRefresh,
      sizeMenus,
      setField,
      fieldList,
      checkedKeys,
      handleDrop,
      handleCheck,
      onFilter,
      showFilter,
      handleChangeShowFilter,
    ]
  );

  const toolbar = useMemo(() => {
    if (typeof toolBarRender === 'function') return toolBarRender(action);
    return action;
  }, [toolBarRender, toolBar, action]);

  return (
    <Wrapper {...props} className="page-container">
      <div className="table__toolbar">{toolbar}</div>

      <div className="table-content">
        <Tabs
          destroyInactiveTabPane={destroyInactiveTabPane}
          activeKey={tabKey}
          onChange={(tabkey: any) => changeTab && changeTab(tabkey)}
        >
          <Tabs.TabPane tab="主表" key="main" className="table-tab-pane">
            <TableContent className="sc-table-warpper" ref={tableContentRef}>
              <Form form={filterForm}>
                {showFilter && (
                  <ResizeTable
                    {...tableProps}
                    loading={loading}
                    resize={resize}
                    onColumnResize={props.onColumnResize}
                    components={tableComponents}
                    scroll={{ x: 0, y: 0, scrollToFirstRowOnChange: true }}
                    size={size}
                    columns={tableColumns}
                  />
                )}
                {!showFilter && (
                  <ResizeTable
                    {...tableProps}
                    loading={loading}
                    resize={resize}
                    onColumnResize={props.onColumnResize}
                    size={size}
                    scroll={{ x: 0, y: 0, scrollToFirstRowOnChange: true }}
                    columns={tableColumns}
                  />
                )}
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
          </Tabs.TabPane>
          {!!editElement && (
            <Tabs.TabPane tab="明细表" key="detail">
              <ContentWrapper>{editElement}</ContentWrapper>
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
      {children}
    </Wrapper>
  );
};

export default React.memo(Layout2Table);
