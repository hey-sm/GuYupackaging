import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

export type ChangeThemeProps = {
  theme?: 'light' | 'dark';
  onChange?: (curTheme: 'light' | 'dark') => void;
};

export const ChangeTheme = ({ theme, onChange }: ChangeThemeProps) => {
  const handleChange = useCallback(() => {
    if (theme === 'light') {
      onChange?.('dark');
    } else {
      onChange?.('light');
    }
  }, [theme, onChange]);

  return (
    <>
      {theme === 'dark' && (
        <SunOutlined className="text-xl" onClick={handleChange} />
      )}
      {theme === 'light' && (
        <MoonOutlined className="text-xl" onClick={handleChange} />
      )}
    </>
  );
};

export default ChangeTheme;
