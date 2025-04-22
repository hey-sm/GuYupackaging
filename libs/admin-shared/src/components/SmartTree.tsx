import { Card, CardProps, Input, Tree, TreeProps, Typography } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { cloneDeep, orderBy } from 'lodash-es';
import Scrollbars from 'rc-scrollbars';
import { Key, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

export type fieldNames = { id: string; parentId: string; title: string };

export type SmartTreeProps = Omit<TreeProps, 'treeData'> & {
  cardProps?: CardProps;
  dataSource: Array<any>;
  fieldNames?: { id?: string; parentId?: string; key?: string; title?: string };
  filter?: (list: any[], keywords: string) => any[];
  showSearch?: boolean;
};

const buildTreeDataNode = (
  data: any[],
  options: { fieldNames: fieldNames }
) => {
  const { fieldNames } = options;
  const items = cloneDeep(data || []);

  const hash: { [key: string]: any } = items.reduce<any>((acc, cur) => {
    const id = cur[fieldNames.id];
    acc[id] = cur;
    return acc;
  }, {});

  const roots = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const parentId = item[fieldNames.parentId];
    const id = item[fieldNames.id];
    const title = item[fieldNames.title];

    item.key = id;
    item.title = title;

    const parent = hash[parentId];

    if (parent) {
      const children = parent.children ?? [];
      children.push(item);
      parent.children = children;
    } else {
      roots.push(item);
    }
  }

  const treeData = orderBy(roots, [fieldNames.parentId], ['asc']);
  return treeData;
};

const defaultFieldNames = {
  id: 'id',
  parentId: 'parentId',
  key: 'id',
  title: 'title',
};

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return parentKey!;
};

export const SmartTree = ({
  cardProps = {},
  dataSource,
  fieldNames = defaultFieldNames,
  style,
  className,
  filter,
  showSearch = true,
  ...rest
}: SmartTreeProps) => {
  const rawData = useMemo(
    () =>
      buildTreeDataNode(dataSource, {
        fieldNames: { ...defaultFieldNames, ...fieldNames },
      }),
    [dataSource, fieldNames]
  );

  const [searchValue, setSearchValue] = useState('');

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = (item.title as string) ?? '';
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <Typography.Text type="danger">{searchValue}</Typography.Text>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );

        if (item.children) {
          return {
            ...item,
            title,
            key: item.key,
            children: loop(item.children),
          };
        }

        return {
          ...item,
          title,
          key: item.key,
        };
      });

    return loop(rawData);
  }, [rawData, searchValue]);

  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const newExpandedKeys = dataSource
      .map((item) => {
        const title = item[fieldNames.title ?? 'title'];

        if (title.indexOf(value) > -1) {
          const key = item[fieldNames.key ?? 'id'];
          return getParentKey(key, rawData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(newExpandedKeys as string[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const onExpand = useCallback((newExpandedKeys: Key[]) => {
    setExpandedKeys(newExpandedKeys as string[]);
    setAutoExpandParent(false);
  }, []);

  return (
    <Container size="small" {...cardProps} style={style} className={className}>
      {showSearch && (
        <Input
          placeholder="请输入"
          onChange={onChange}
          allowClear
          style={{ width: '100%', marginBottom: 10 }}
        />
      )}

      <Scrollbars>
        <Tree
          {...rest}
          treeData={treeData}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        />
      </Scrollbars>
    </Container>
  );
};

const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: ${(props) => props.theme['@tree-card-width']};

  .ant-card-head {
    margin-bottom: 0;
  }

  .ant-card-body {
    flex: 1;
    padding: 0;
  }
`;

export default SmartTree;
