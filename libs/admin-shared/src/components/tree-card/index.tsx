import { CardProps, Input, Space, Spin, TreeProps, Typography } from 'antd';
import { debounce, first, unionBy } from 'lodash-es';
import ScrollBar from 'rc-scrollbars';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useState,
} from 'react';

import Tree from '../tree';
import { CardWrapper, ContentWrapper, Keywords } from './style';

/** 树 数据类型 */
export declare type TreeCardData = {
  /** 主键 */
  id: string;
  /** 上级主键 */
  pId: string;
  /** 标题 */
  title: string;
  /** 值 */
  value: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可选 */
  selectable?: boolean;
};

export interface TreeCardProps<T> extends CardProps {
  /** 宽度，没设置宽度跟随theme['@tree-card-width'] */
  width?: number;
  /** Card标题 */
  title?: React.ReactNode;
  /** 节点选中事件 */
  onNodeSelect?: (v?: T) => void;
  /** 获取数据方法 */
  fetchData?: () => Promise<T[]>;
  /** 筛选方法 */
  filter?: (list: T[], keywords: string) => T[];
  /** 树配置 */
  treeProps?: TreeProps;
  /** 默认选中 */
  defaultSelectFirst?: boolean;
  /** 数据初始化完成回调 */
  onInitData?: (list: T[]) => void;
}

declare type RequestState = {
  loading?: boolean;
};

export interface TreeCardRef {
  reload: () => void;
  clear: () => void;
}

/** Card树形选择组件*/
const TreeCard = forwardRef<TreeCardRef, TreeCardProps<TreeCardData>>(
  (
    {
      width,
      title,
      treeProps = {},
      defaultSelectFirst = false,
      fetchData,
      filter,
      onNodeSelect,
      onInitData,
      ...props
    },
    ref
  ) => {
    const [{ loading }, dispatchState] = useReducer(
      (state: RequestState, news: RequestState) => ({ ...state, ...news }),
      { loading: false }
    );
    const [dataSource, setDataSource] = useState<TreeCardData[]>([]);
    const [searchKey, setSearchKey] = useState('');
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const showFilter = useMemo(() => !!filter, [filter]);

    /** 清理数据 */
    const clearData = () => {
      setDataSource([]);
      setSelectedKeys([]);
      setExpandedKeys([]);
      setSearchKey('');
    };

    /** 初始化数据 */
    const initialized = async () => {
      clearData();
      const list = await refresh();
      onInitData?.(list || []);
      if (defaultSelectFirst) defaultSelect(list || []);
    };

    useEffect(() => {
      fetchData && initialized();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData]);

    /** 刷新数据 */
    const refresh = async () => {
      if (fetchData) {
        dispatchState({ loading: true });
        const list = (await fetchData()) || [];
        setDataSource(list);
        dispatchState({ loading: false });
        return list;
      }
      return [];
    };

    const defaultSelect = (list: TreeCardData[]) => {
      const firstNode = first(list);
      const selectNode = list.find((v) => selectedKeys.includes(v.id));
      const node = selectNode ? selectNode : firstNode;
      if (onNodeSelect) onNodeSelect(node);
      if (firstNode && !selectNode) {
        setSelectedKeys([firstNode.id]);
        setExpandedKeys([firstNode.id]);
      }
    };

    useImperativeHandle(ref, () => ({
      reload: () => {
        refresh();
      },
      clear: () => {
        setSelectedKeys([]);
        setExpandedKeys([]);
        setSearchKey('');
      },
    }));

    /** 节点筛选 */
    const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const keywords = e.target.value;
      setSearchKey(keywords);
    }, 300);

    const handleExpand = useCallback((keys: any) => {
      setExpandedKeys(keys);
    }, []);

    const handleSelect = (keys: React.Key[], info: any) => {
      const { selectedNodes = [] } = info as { selectedNodes: TreeCardData[] };
      setSelectedKeys(keys as string[]);
      if (onNodeSelect) onNodeSelect(selectedNodes[0] || null);
    };

    /** 筛选加高亮 */
    const getSearchTitle = useCallback((title: string, keywords: string) => {
      const index = title.indexOf(keywords);
      const beforeStr = title.substring(0, index);
      const afterStr = title.substring(index + keywords.length);

      const titleNode =
        index > -1 ? (
          <Typography.Text>
            {beforeStr}
            <Keywords>{keywords}</Keywords>
            {afterStr}
          </Typography.Text>
        ) : (
          <Typography.Text>{title}</Typography.Text>
        );
      return titleNode;
    }, []);

    const getParents = (parentIds: string[]): TreeCardData[] => {
      const currs = dataSource.filter((v) => parentIds.includes(v.id));
      const parents: TreeCardData[] = [];
      if (currs.length > 0) {
        parents.push(...getParents(currs.map((v) => v.pId)));
      }
      return [...currs, ...parents];
    };

    /** 数据筛选 */
    const treeData = useMemo(() => {
      let data = [...dataSource];

      if (searchKey && filter) {
        data = filter(data, searchKey);
        const unionParents = unionBy(getParents(data.map((o) => o.pId)), 'id');
        setExpandedKeys(unionParents.map((v) => v.id));
        data.push(...unionParents);
      }
      return unionBy(data, 'id').map((v) => ({
        ...v,
        title: getSearchTitle(v.title, searchKey),
      }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchKey, dataSource, filter]);
    return (
      <CardWrapper title={title} size="small" {...props} width={width}>
        <ScrollBar>
          <Spin spinning={loading}>
            <ContentWrapper>
              <Space
                direction="vertical"
                align="start"
                style={{ width: '100%' }}
              >
                {showFilter && (
                  <Input
                    placeholder="请输入"
                    onChange={handleSearch}
                    size="small"
                    allowClear
                    style={{ width: '100%' }}
                  />
                )}
                <Tree
                  onSelect={handleSelect}
                  selectedKeys={selectedKeys}
                  {...treeProps}
                  treeData={treeData}
                  expandedKeys={expandedKeys}
                  onExpand={handleExpand}
                  blockNode
                />
              </Space>
            </ContentWrapper>
          </Spin>
        </ScrollBar>
      </CardWrapper>
    );
  }
);

export default TreeCard;
