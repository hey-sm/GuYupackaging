import { ColumnHeightOutlined } from '@ant-design/icons';
import { Menu, Tooltip, Dropdown } from 'antd';
import React, { useMemo } from 'react';

export interface DensityProps {
  value: string;
  onChange: (value: string) => void;
}
const Density = ({ value, onChange }: DensityProps) => {
  const densityItems = useMemo(
    () => (
      <Menu
        selectable
        selectedKeys={[value]}
        onSelect={(e) => {
          onChange(e.selectedKeys[0]);
        }}
        items={[
          {
            label: '默认',
            key: 'large',
          },
          {
            label: '中等',
            key: 'middle',
          },

          {
            label: '紧凑',
            key: 'small',
          },
        ]}
      />
    ),
    [onChange, value]
  );

  return (
    <div className="table-list-toolbar-setting-item">
      <Tooltip placement="top" title="密度">
        <Dropdown overlay={densityItems} trigger={['click']}>
          <ColumnHeightOutlined />
        </Dropdown>
      </Tooltip>
    </div>
  );
};

export default Density;
