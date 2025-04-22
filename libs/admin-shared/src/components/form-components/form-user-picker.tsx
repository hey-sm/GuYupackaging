import { Input, Space, Table, Card } from 'antd';
import React from 'react';
import styled from 'styled-components';
import DraggableModal from '../draggable-modal';

import TreeCard, { TreeCardData } from '../tree-card';

export const TableWapper = styled.div`
  .row-selected td {
    background-color: ${(props) => props.theme['@primary-color']} !important;
    color: #fff !important;
  }
`;

export const Wrapper = styled.div<{ height: number }>`
  height: ${(props) => props.height}px;
  display: flex;
  > .left {
    width: ${(props) => props.theme['@tree-card-width']};
    display: flex;
    flex-direction: column;
    .ant-card-body {
      flex: 1;
      padding: 0;
    }
  }

  > .right {
    margin-left: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .ant-card-body {
      flex: 1;
      .ka-wrapper {
        height: 100%;
      }
    }
  }
`;

interface UserPickerProps {
  value?: string;
  onChange?: (value: string, label: string) => void;
  placeholder?: string;
  defaultLabel?: string;
  pageTotal?: number;
  tableDataList?: any[];
  loading?: boolean;
  orgTree?: TreeCardData[];
  onloadTable?: (data: any) => void;
}

const UserPicker: React.FC<UserPickerProps> = ({
  loading,
  tableDataList,
  orgTree,
  value,
  pageTotal,
  defaultLabel,
  placeholder,
  onChange,
  onloadTable,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [{ page, size, total }, dispatchPage] = React.useReducer(
    (state: any, news: Partial<any>) => ({ ...state, ...news }),
    { page: 1, size: 20, total: 0 }
  );
  const [selectData, setSelectData] = React.useState<any | null>(null);
  const [tableList, setTableList] = React.useState<any[]>([]);
  const searchRef = React.useRef<{ orgId?: string; keyWord: string }>();
  const [valueData, setValueData] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (value) {
      const v = tableList.find((o) => o.customerId === value) || null;
      setSelectData(v);
    }
  }, [value, tableList]);

  /** 打开model */
  const handleShowModal = React.useCallback(() => {
    loadMenus();
    if (tableList.length <= 0 && onloadTable) onloadTable({ page: 1, size });
    setShowModal(true);
  }, [tableList, size]);

  /** 设置表格数据 */
  React.useEffect(() => {
    setTableList(tableDataList || []);
  }, [tableDataList]);

  /** 设置页码 */
  React.useEffect(() => {
    dispatchPage({ total: pageTotal });
  }, [pageTotal]);

  /** 分页加载 */
  const loadPage = React.useCallback(
    async (page: number, pageSize?: number) => {
      dispatchPage({ page, size: pageSize || size });
      const data = { size: pageSize || size, page, ...searchRef.current };
      if (onloadTable) onloadTable(data);
    },
    [size]
  );

  const handleChangeSelect = React.useCallback(
    (v?: TreeCardData) => {
      const data = { page: 1, size: 10, ...searchRef.current, orgId: v?.id };
      if (onloadTable) onloadTable(data);
    },
    [size, onloadTable]
  );

  const onSearch = React.useCallback(
    (v: string) => {
      searchRef.current = { ...searchRef.current, keyWord: v };
      if (onloadTable) onloadTable({ page: 1, size, ...searchRef.current });
    },
    [size, onloadTable]
  );

  const handleOk = React.useCallback(() => {
    setValueData(selectData);
    setShowModal(false);
    if (onChange)
      onChange(selectData?.customerId || '', selectData?.customerNameCn || '');
  }, [selectData, onChange]);

  const handleDbClickOk = React.useCallback(
    (v: any) => {
      setValueData(v);
      setShowModal(false);
      if (onChange) onChange(v?.customerId || '', v?.customerNameCn || '');
    },
    [onChange]
  );

  /** 分页器 */
  const pager = React.useMemo(
    () => ({
      current: page,
      pageSize: size,
      total: total,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total: number) => `共 ${total} 条数据`,
      onChange: loadPage,
    }),
    [page, size, total]
  );

  /** 加载菜单 */
  const loadMenus = React.useCallback(async () => orgTree ?? [], [orgTree]);

  /** 菜单筛选 */
  const handleFilterMenu = React.useCallback(
    (dataSource: TreeCardData[], keywords: string) =>
      dataSource.filter((v) => v.title?.includes(keywords)),
    []
  );

  return (
    <React.Fragment>
      <Input
        value={valueData?.customerNameCn || defaultLabel}
        placeholder={placeholder}
        readOnly
        onClick={handleShowModal}
      />
      <Input
        type="hidden"
        placeholder={placeholder}
        value={value}
        onClick={handleShowModal}
      />

      <DraggableModal
        title="组织人员"
        width={1200}
        height={600}
        visible={showModal}
        onOk={handleOk}
        onCancel={() => setShowModal(false)}
      >
        <Wrapper height={600}>
          <TreeCard
            width={220}
            title="功能菜单"
            fetchData={loadMenus}
            filter={handleFilterMenu}
            onNodeSelect={handleChangeSelect}
            defaultSelectFirst
          />
          <Card size="small" className="right">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input.Search
                placeholder="请输入关键字"
                onSearch={onSearch}
                allowClear
                enterButton
                style={{ width: '300px' }}
              />
              <TableWapper>
                <Table
                  rowKey="customerId"
                  loading={loading}
                  pagination={pager}
                  dataSource={tableList}
                  bordered
                  style={{ height: '500px' }}
                  size="small"
                  onRow={(record) => {
                    return {
                      onClick: () => setSelectData(record),
                      onDoubleClick: () => handleDbClickOk(record),
                    };
                  }}
                  rowClassName={(record) =>
                    record.customerId === selectData?.customerId
                      ? 'row-selected'
                      : ''
                  }
                >
                  <Table.Column title="帐户登录名称" dataIndex="customerName" />
                  <Table.Column title="职员名称" dataIndex="customerNameCn" />
                  <Table.Column title="帐户ID" dataIndex="customerId" />
                </Table>
              </TableWapper>
            </Space>
          </Card>
        </Wrapper>
      </DraggableModal>
    </React.Fragment>
  );
};

export default UserPicker;
