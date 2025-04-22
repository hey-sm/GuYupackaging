import { Cascader } from 'antd';
import React from 'react';

export declare type AreaData = {
  /** 地区编号 */
  areaCode?: string;
  /** 地区名称 */
  areaName?: string;
  /** 父级code */
  parentCode?: string;

  /** 省编码 */
  provinceCode?: string;
  /** 省 */
  provinceName?: string;
  /** 市编码 */
  cityCode?: string;
  /** 市 */
  cityName?: string;
  /** 县/区 编码 */
  districtCode?: string;
  /** 县/区 */
  districtName?: string;
  /** 街道编码 */
  streetCode?: string;
  /** 街道名称 */
  streetName?: string;
};

export type AreaPickerProps = {
  value?: any;
  onChange?: (v: any) => void;
  dataSource?: Array<AreaData>;
  [key: string]: any;
};

/** 省市区，树形选择FormItem组件 */
const AreaPicker = ({
  value,
  onChange,
  dataSource = [],
  ...props
}: AreaPickerProps) => {
  const valueArray = React.useMemo(() => {
    const item = dataSource.find((v: any) => v.areaCode === value) as any;
    return item
      ? [item.provinceCode, item.cityCode, item.districtCode]
      : undefined;
  }, [value, dataSource]);

  const areaTree = React.useMemo(() => {
    const parents = dataSource.filter(
      (o: any) => !o.parentCode || o.parentCode === '0'
    );
    const tree = parents.map((p: any) => ({
      value: p.provinceCode,
      label: p.provinceName,
      children: dataSource
        .filter((o: any) => o.parentCode === p.provinceCode)
        .map((c: any) => ({
          label: c.cityName,
          value: c.cityCode,
          children: dataSource
            .filter((o: any) => o.parentCode === c.cityCode)
            .map((d: any) => ({
              label: d.districtName,
              value: d.districtCode,
            })),
        })),
    }));
    return tree;
  }, [dataSource]);

  const handleChange = (v: any) => {
    const value = v ? v.toString() : undefined;
    if (onChange) onChange(value);
  };

  return (
    <Cascader
      {...props}
      value={valueArray}
      onChange={handleChange}
      options={areaTree}
    />
  );
};

export default AreaPicker;
