import { CloseCircleFilled } from '@ant-design/icons';
import { Input } from 'antd';
import React, { ReactNode } from 'react';
import { IconsModal } from '../app-icons';

interface IconPickerProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  enterButton?: ReactNode;
}

/** 自定义图标选中FormItem组件 */
const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  placeholder = '请选择图标',
  enterButton,
}) => {
  const [curValue, setCurValue] = React.useState(value);
  const [showIcon, setShowIcon] = React.useState(false);

  React.useEffect(() => {
    setCurValue(value);
  }, [value]);

  const handleClearIcon = React.useCallback(() => {
    setCurValue('');
    if (onChange) onChange('');
  }, [onChange]);

  const handleSelectIcon = React.useCallback(
    (icon: string) => {
      setCurValue(icon);
      if (onChange) onChange(icon);
    },
    [onChange]
  );

  const showClear = React.useMemo(() => !!curValue, [curValue]);

  return (
    <React.Fragment>
      <Input.Search
        value={curValue}
        placeholder={placeholder}
        enterButton={enterButton}
        suffix={
          showClear ? (
            <CloseCircleFilled
              className="ant-input-clear-icon"
              onClick={handleClearIcon}
            />
          ) : null
        }
        onSearch={() => setShowIcon(true)}
        readOnly
      />

      <IconsModal
        visible={showIcon}
        onCancel={() => setShowIcon(false)}
        onOk={handleSelectIcon}
      />
    </React.Fragment>
  );
};

export default IconPicker;
