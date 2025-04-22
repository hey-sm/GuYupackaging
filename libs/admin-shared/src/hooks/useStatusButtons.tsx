import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useMemo, useState } from 'react';

type Status = 'enable' | 'disable';
type ButtonOption = {
  label: string;
  icon: React.ReactNode;
  status: Status;
  key?: string;
  danger: boolean;
};
type Options = {
  keys: [string, string];
  request: (status: Status) => Promise<void>;
  permissions: string[];
  items: any[];

  renderDisableButton?: (
    dom: React.ReactNode,
    opt: ButtonOption,
    disabled: boolean,
    loading: boolean,
    request: () => Promise<void>
  ) => React.ReactNode;
};

const buttonOptions: ButtonOption[] = [
  {
    label: '启用',
    icon: <CheckCircleOutlined />,
    status: 'enable',
    danger: false,
  },
  { label: '禁用', icon: <StopOutlined />, status: 'disable', danger: true },
];

function isEnableStatus(items: any[], status = 'enable') {
  if (items.length <= 0) return false;
  return items.some((v) => v.status !== status);
}

export const useStatusButtons = ({
  keys,
  request,
  permissions,
  items,
  renderDisableButton,
}: Options) => {
  const [loading, setLoading] = useState(false);

  const options = useMemo(
    () => keys.map((v, i) => ({ ...buttonOptions[i], key: v })),
    [keys]
  );

  const handleClick = async (status: Status) => {
    setLoading(true);
    try {
      await request(status);
    } finally {
      setLoading(false);
    }
  };

  const buttons = useMemo(() => {
    return options
      .filter((v) => permissions.includes(v.key))
      .map((v) => {
        const disabled = !isEnableStatus(items, v.status);
        const dom = (
          <Button
            type="primary"
            key={v.key}
            icon={v.icon}
            loading={loading}
            onClick={() => handleClick(v.status)}
            disabled={disabled}
            danger={v.danger}
          >
            {v.label}
          </Button>
        );

        if (v.status === 'disable' && renderDisableButton) {
          return renderDisableButton(dom, v, disabled, loading, () =>
            handleClick(v.status)
          );
        }

        return dom;
      });
  }, [options, permissions, loading, items]);

  return {
    buttons,
  };
};
