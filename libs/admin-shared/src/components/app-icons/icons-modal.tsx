import { SearchOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { debounce } from 'lodash-es';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid } from 'react-window';
import DraggableModal from '../draggable-modal';
import CusIcon from './icons';
import config from './icons.json';
import { IconWrapper } from './style';

interface IProps {
  /** 是否显示 */
  visible: boolean;
  /** 取消回调 */
  onCancel?: () => void;
  /** 选中回调 */
  onOk?: (icon: string) => void;
}

/** 公共自定义图标选择弹框组件 */
const IconsModal: React.FC<IProps> = ({ visible, onCancel, onOk }) => {
  const [filterData, setFilterData] = React.useState(config.glyphs);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = React.useCallback(
    debounce((txt: string) => {
      const list = config.glyphs.filter((v) => v.font_class.includes(txt));
      setFilterData(list);
    }, 300),
    []
  );

  const handleSelect = React.useCallback(
    (icon: string) => {
      if (onOk) onOk(icon);
      if (onCancel) onCancel();
    },
    [onOk, onCancel]
  );

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const i = rowIndex * 6 + columnIndex;
    const v = filterData[i];
    if (!v) return null;

    return (
      <div style={style}>
        <IconWrapper onClick={() => handleSelect(v.font_class)}>
          <CusIcon type={v.font_class} style={{ fontSize: 24 }} />
          <span>{v.font_class}</span>
        </IconWrapper>
      </div>
    );
  };

  return (
    <DraggableModal
      destroyOnClose
      visible={visible}
      title="请选择图标"
      width={1200}
      onCancel={onCancel}
      footer={null}
      showFullScreen={false}
      scroll={false}
    >
      <Form.Item>
        <Input
          placeholder="输入关键词搜索图标"
          onChange={(e) => handleSearch(e.currentTarget.value)}
          suffix={<SearchOutlined />}
          allowClear
        />
      </Form.Item>
      <div style={{ height: 500 }}>
        <AutoSizer>
          {({ width, height }) => (
            <Grid
              width={width}
              height={height}
              columnCount={6}
              columnWidth={Math.floor((width - 14) / 6)}
              rowCount={Math.ceil(filterData.length / 6)}
              rowHeight={96}
            >
              {Cell}
            </Grid>
          )}
        </AutoSizer>
      </div>
    </DraggableModal>
  );
};

export default IconsModal;
