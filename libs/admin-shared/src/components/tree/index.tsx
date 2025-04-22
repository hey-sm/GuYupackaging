import { Tree as AndTree, TreeProps } from 'antd';
import React from 'react';

export interface ITreeProps extends Omit<TreeProps, 'treeData'> {
  /** 数据 */
  treeData: any[];
}

/** 简单数据结构树 */
const Tree: React.FC<ITreeProps> = ({ treeData, ...props }) => {
  const deep: any = (pId: string): any => {
    return treeData
      .filter((v) => v.pId === pId)
      .map((v) => ({
        ...v,
        key: v.id,
        title: v.title,
        children: deep(v.id),
      }));
  };

  const getTree = () => {
    const parents = treeData.filter(
      (v) => !treeData.some((o) => o.id === v.pId)
    );
    const tree = parents.map((v) => ({
      ...v,
      key: v.id,
      title: v.title,
      children: deep(v.id),
    }));
    return tree;
  };

  const data = React.useMemo(() => getTree(), [treeData]);
  return <AndTree treeData={data} {...props} />;
};

export default Tree;
