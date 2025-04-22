import { createFromIconfontCN } from '@ant-design/icons';
import { IconBaseProps } from '@ant-design/icons/lib/components/Icon';
import React from 'react';
import config from './icons.json';

interface IProps extends IconBaseProps {
  /** 图标字符串 */
  type: string;
}

/** 淮海自定义图标 */
const AppIcon: React.FC<IProps> = ({ type, ...props }) => {
  const IconFont = React.useMemo(
    () =>
      createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_2607256_4klvphqsdrd.js', //'//at.alicdn.com/t/font_2607256_5f32sq0t60o.js',
      }),
    []
  );

  return <IconFont {...props} type={config.css_prefix_text + type} />;
};

export default AppIcon;
