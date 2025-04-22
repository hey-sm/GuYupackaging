import React from 'react';
import { SysRoleColumnMenuResponse } from '../model';

const useFieldsPermissions = (permissions?: SysRoleColumnMenuResponse) => {
  /** 验证字段权限 */
  const isFieldAuth = React.useCallback(
    (columnDefine: string): boolean => {
      if (permissions?.isAmin) return true;
      const list = permissions?.datas || [];
      return list.some((v: any) => v.columnDefine === columnDefine);
    },
    [permissions]
  );

  return { isFieldAuth };
};

export default useFieldsPermissions;
