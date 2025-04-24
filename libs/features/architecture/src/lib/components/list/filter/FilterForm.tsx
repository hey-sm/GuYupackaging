import {
  ProForm,
  QueryFilter,
  QueryFilterProps,
} from '@ant-design/pro-components';
import { Down, Redo, Search, Up } from '@icon-park/react';
import { Button } from 'antd';
import { uniqueId } from 'lodash-es';

import { FC, ReactNode, useEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { useListContext } from '../../../context';

export type FilterFormProps = QueryFilterProps;

export const FilterForm: FC<
  FilterFormProps & {
    children: ReactNode;
    onReset?: () => void;
    cref?: any;
    search?: any;
    callBack?: (params: any) => void;
  }
> = (props) => {
  const { onReset: onResetProp, children, callBack, ...formProps } = props;
  const { setFilters, displayedFilters, filterValues, refetch } =
    useListContext();
  const [form] = ProForm.useForm();

  useEffect(() => {
    form.setFieldsValue(filterValues);
    callBack?.(filterValues);
  }, [filterValues, form]);

  useImperativeHandle(props.cref, () => ({
    setTeams: (param: any, flag?: boolean) => {
      if (flag) {
        refetch?.();
      } else {
        setFilters({ ...filterValues, ...param }, displayedFilters);
        form.setFieldsValue({ ...param });
      }
    },
  }));

  return (
    <Root>
      <QueryFilter
        {...formProps}
        collapseRender={(collapsed) => {
          return (
            <Button>
              {collapsed ? (
                <Down theme="outline" size="16" fill="#4E5969" />
              ) : (
                <Up theme="outline" size="16" fill="#4E5969" />
              )}
            </Button>
          );
        }}
        colon={false}
        form={form}
        onFinish={async (values) => {
          if (props?.search) {
            setFilters(
              { ...values, queries: uniqueId('queries-'), ...props?.search },
              displayedFilters
            );
          } else {
            setFilters(
              { ...values, queries: uniqueId('queries-') },
              displayedFilters
            );
          }
        }}
        onReset={() => {
          if (props?.search) {
            setFilters(
              { queries: uniqueId('queries-'), ...props?.search },
              displayedFilters
            );
          } else {
            setFilters({ queries: uniqueId('queries-') }, displayedFilters);
          }

          onResetProp?.();
        }}
        submitter={{
          submitButtonProps: {
            icon: <Search theme="outline" size="16" fill="#fff" />,
          },
          resetButtonProps: {
            icon: <Redo theme="outline" size="16" fill="#4E5969" />,
          },
          render(props, dom) {
            return [dom[1], dom[0]];
          },
        }}
      >
        {children}
      </QueryFilter>
    </Root>
  );
};

const Root = styled.div`
  .ant-input,
  .ant-picker-input > input {
    &::placeholder {
      /* color: #86909c; */
    }
  }

  .ant-pro-query-filter-actions {
    .i-icon {
      display: flex;
      margin-right: 8px;
    }

    .ant-btn-primary {
      display: flex;
      align-items: center;
      border: none;
    }

    .ant-btn-default {
      display: flex;
      align-items: center;
      border: none;
    }
  }

  .ant-pro-query-filter-collapse-button {
    .i-icon {
      display: flex;
      margin: 0;
    }

    .ant-btn-default {
      width: 32px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export default FilterForm;
