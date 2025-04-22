import { Button, Popover } from 'antd';
import React from 'react';
import { SketchPicker } from 'react-color';
import CusIcon from '../app-icons';

interface ColorPickerProps {
  value?: string;
  fontSize?: number;
  onChange?: (hex: string) => void;
}

/** 颜色选中FormItem组件 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  fontSize = 24,
  onChange,
}) => {
  const hanleChange = ({ hex }: { hex: string }) => {
    if (onChange) onChange(hex);
  };

  return (
    <Popover
      content={<SketchPicker color={value} onChange={hanleChange} />}
      trigger="click"
    >
      <Button
        type="text"
        icon={<CusIcon type="color" style={{ color: value, fontSize }} />}
      ></Button>
    </Popover>
  );
};

export default ColorPicker;
