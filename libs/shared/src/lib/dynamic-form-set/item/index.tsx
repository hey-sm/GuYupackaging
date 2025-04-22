import { FormItemProps } from 'antd';

import React, { useContext, useMemo } from 'react';
import auth from '../../auth';
import { DynamicFormPanelContext } from '../../form-dynamic';

import FormAreas from './areas';
import FormCode from './code';
import FormCompany from './company';
import FormDate from './date';
import FormDepartment from './department';
import FormInput from './input';
import FormNumber from './number';
import FormSelect from './select';
import FormText from './textarea';
import FormUpload from './upload';
import FormUploadImg from './upload-img';

export {
  FormText,
  FormNumber,
  FormUpload,
  FormUploadImg,
  FormAreas,
  FormDepartment,
  FormCompany,
  FormCode,
};

interface IProps extends FormPropsBase, FormItemProps {}

export const DynamicFormItem: React.FC<IProps> = ({ field, ...props }) => {
  /** 加载数据字典 */
  const context = useContext(DynamicFormPanelContext);

  const headers = useMemo(() => ({ Authorization: auth.getToken() ?? '' }), []);

  // const areaList = useGetAreaTree({ type: 'list' });

  if (field.columnType === 'string') {
    return <FormInput field={field} {...props} />;
  }
  if (field.columnType === 'text') {
    return <FormText field={field} {...props} />;
  }
  if (field.columnType === 'number') {
    return <FormNumber field={field} {...props} />;
  }
  if (field.columnType === 'options') {
    return (
      <FormSelect field={field} {...props} fetchData={context.getDictRequest} />
    );
  }
  if (field.columnType === 'date') {
    return <FormDate field={field} {...props} />;
  }
  if (field.columnType === 'upload') {
    return <FormUpload field={field} {...props} headers={headers} />;
  }
  if (field.columnType === 'upload-img') {
    return <FormUploadImg field={field} {...props} headers={headers} />;
  }
  if (field.columnType === 'code') {
    return <FormCode field={field} {...props} />;
  }
  // if (field.columnType === 'areas') {
  //   return (
  //     <FormAreas field={field} dataSource={areaList.data?.data} {...props} />
  //   );
  // }
  // if (field.columnType === 'department') {
  //   return <FormDepartment field={field} {...props} fetchData={loadDepts} />;
  // }
  // if (field.columnType === 'company') {
  //   return <FormCompany field={field} {...props} fetchData={loadCompany} />;
  // }
  // if (field.columnType === 'user') {
  //   return (
  //     <FormUser
  //       field={field}
  //       {...props}
  //       fetchOrg={loadOrgMenus}
  //       fetchData={loadUserPage}
  //     />
  //   );
  // }
  return null;
};
