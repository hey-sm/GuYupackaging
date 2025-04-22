import { ExportOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../auth';
import excel from '../utils/excel';

export interface ExportExcelDropdownProps<RecordType extends object = any> {
  dataSource: {
    columns: ColumnsType<RecordType>;
    selectedRows: RecordType[];
    rows: RecordType[];
  };
}

export const ExportExcelDropdown = (props: ExportExcelDropdownProps) => {
  const {
    dataSource: { columns, selectedRows, rows },
  } = props;

  const menus = useAuthStore((state) => state.menus);
  const { pathname } = useLocation();
  const currentMenu = menus.find((v) => v.path === pathname);

  const header = useMemo(
    () =>
      columns
        .filter((v: any) => v.dataIndex !== 'option')
        .map((v: any) => ({
          header: v.title,
          key: v.dataIndex,
          width: Math.floor(v.width / 10),
        })),
    [columns]
  );

  const exportRows = useCallback(() => {
    const data = selectedRows.map((v, i) => ({ index: i + 1, ...v }));
    excel.export({ header, data }, currentMenu?.name);
  }, [currentMenu?.name, header, selectedRows]);

  const exportTable = useCallback(() => {
    const data = rows.map((v, i) => ({ index: i + 1, ...v }));
    excel.export({ header, data }, currentMenu?.name);
  }, [currentMenu?.name, header, rows]);

  const menu = useMemo(() => {
    return (
      <Menu
        items={[
          {
            key: 'row',
            label: '导出选择行',
            onClick: exportRows,
            disabled: selectedRows.length === 0,
          },
          { key: 'table', label: '导出当前表格', onClick: exportTable },
        ]}
      />
    );
  }, [exportRows, exportTable, selectedRows.length]);

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button type="primary" icon={<ExportOutlined />}>
        导出
      </Button>
    </Dropdown>
  );
};

export default ExportExcelDropdown;
