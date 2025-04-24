import React, { useMemo } from 'react';
import { Dropdown } from 'antd';
import { TranslationOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/interface';
import { useTranslation } from 'react-i18next';
import clx from 'classnames';
import { createGlobalStyle, css } from 'styled-components';

export const SwitchLang = () => {
  const { i18n } = useTranslation();
  const currentLang = useMemo(() => i18n.language, [i18n.language]);
  const items: (ItemType & { value?: string })[] = useMemo(() => {
    return [
      {
        key: 'zh',
        label: (
          <div
            className={clx({
              'px-4 py-3': true,
              'bg-[var(--ant-color-primary-bg-hover)] rounded-[4px] text-color-primary':
                currentLang === 'zh',
            })}
          >
            中文
          </div>
        ),
        // disabled: true,
        onClick: () => {
          i18n.changeLanguage('zh');
        },
      },
      {
        type: 'divider',
      },
      {
        key: 'en',
        label: (
          <div
            className={clx({
              'px-4 py-3': true,
              'bg-[var(--ant-color-primary-bg-hover)] rounded-[4px] text-color-primary':
                currentLang === 'en',
            })}
          >
            English
          </div>
        ),
        // extra: '⌘S',
        onClick: () => {
          i18n.changeLanguage('en');
        },
      },
    ];
  }, [i18n, currentLang]);
  return (
    <>
      <GlobalStyle />
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        overlayClassName="language-menu-dropdown"
      >
        <a>
          <TranslationOutlined className="text-xl" />
        </a>
      </Dropdown>
    </>
  );
};

export default SwitchLang;

const GlobalStyle = createGlobalStyle`${css`
  .language-menu-dropdown {
    .ant-dropdown-menu {
      box-shadow: 2px 2px 8px 0px rgba(82, 90, 102, 0.08),
        1px 1px 2px 0px rgba(82, 90, 102, 0.04);
      top: 5px;
      .ant-dropdown-menu-item {
        padding: 0;
        border-radius: 6px;
        font-size: 12px;
        line-height: 12px;
        &:hover {
          color: var(--ant-color-primary, '#0081ff');
          /* background: #e8f4ff; */
        }
      }
    }
  }
`}
`;
