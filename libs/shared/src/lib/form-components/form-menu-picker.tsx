import { TreeSelect } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';

export declare type MenuBase = {
  /** 菜单ID */
  id?: string;
  /** 父级菜单id */
  parentId?: string;
  /** 菜单名称 */
  name?: string;
};

declare type MenuTree = {
  value: string;
  title: string;
  children?: Array<MenuTree>;
};

interface IProps<T> {
  loading?: boolean;
  dataSource?: Array<T>;
  value?: string;
  onChange?: (value: string, menu?: T) => void;
}

export const FormMenuPicker = <T extends MenuBase = any>({
  loading,
  dataSource,
  value,
  onChange,
}: IProps<T>) => {
  const [dataSouceList, setDataSource] = useState<T[]>([]);

  useEffect(() => {
    setDataSource(dataSource || []);
  }, [dataSource]);

  /** 递归数据*/
  const dataDeep = useCallback((dataSource: T[], pid: string): MenuTree[] => {
    return dataSource
      .filter((v: any) => v.parentId === pid)
      .map((v: any) => {
        const children = dataDeep(dataSource, v.id);
        return { value: v.id, title: v.name, children };
      });
  }, []);

  const handleChange = React.useCallback(
    (value: string) => {
      const select = dataSouceList.find((v) => v.id === value);
      if (onChange) onChange(value, select);
    },
    [dataSouceList, onChange]
  );

  const treeData = React.useMemo(
    () => dataDeep(dataSouceList, '0'),
    [dataDeep, dataSouceList]
  );

  return (
    <TreeSelect
      loading={loading}
      value={value}
      onChange={handleChange}
      allowClear
      treeData={treeData}
      placeholder="请选择"
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    />
  );
};

export default FormMenuPicker;
