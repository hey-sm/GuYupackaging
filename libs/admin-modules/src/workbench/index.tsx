import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterForm, List, Table } from '@org/features/architecture';
import { ProFormText } from '@ant-design/pro-components';

export const Workbench = () => {
  // const { t } = useTranslation();
  return (
    // <div className="w-full h-full flex items-center justify-center text-[36px] text-color-primary">
    //   {t('workbench.welcome')}
    // </div>
    <List
      filters={
        <FilterForm>
          <ProFormText label="会员编码" name="memberNo" />
          <ProFormText label="姓名" name="realName" />
          <ProFormText label="手机号" name="mobile" />
          <ProFormText label="所属企业" name="comName" />
        </FilterForm>
      }
    >
      <Table
        title={() => {
          return '列表';
        }}
      ></Table>
    </List>
  );
};

export default Workbench;
