import { Space } from 'antd';
import clsx from 'clsx';
import { FC, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import { ListControllerProps } from '../../controller';
import { RaRecord } from '../../types';
import { ListBase } from './ListBase';

export interface ListProps<RecordType extends RaRecord = any>
  extends ListControllerProps<RecordType> {
  className?: string;
  actions?: ReactElement | false;
  aside?: ReactElement;
  bulkActionButtons?: ReactElement | false;
  filters?: ReactNode;
}

export const List: FC<ListProps & { children?: ReactNode }> = ({
  className,
  filter,
  filterDefaultValues,
  perPage,
  queryOptions,
  resource,
  sort,
  actions,
  aside,
  bulkActionButtons,
  filters,
  children,
}) => {
  return (
    <ListBase
      resource={resource}
      filter={filter}
      filterDefaultValues={filterDefaultValues}
      perPage={perPage}
      queryOptions={queryOptions}
      sort={sort}
    >
      <Root className={clsx('list-page', className)}>
        {aside}
        <div className="main">
          {!!filters && (
            <div
              className="
          filters
               shadow-md
          dark:shadow-[0_0_5px_0_rgba(210,210,210,13.08),0_2px_0_0_rgba(210,210,210,6.04)]"
            >
              {filters}
            </div>
          )}

          {(!!actions || !!bulkActionButtons) && (
            <Space className="actions">
              {actions} {bulkActionButtons}
            </Space>
          )}

          <div className="content">{children}</div>
        </div>
      </Root>
    </ListBase>
  );
};

const Root = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;

  .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    width: 0;
  }

  .table {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .filters {
    /* box-shadow: 2px 2px 8px 0px rgba(82, 90, 102, 0.08),
      1px 1px 2px 0px rgba(82, 90, 102, 0.04); */
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    /* background-color: #fff; */
    margin-bottom: 2px;
    z-index: 10;
    position: relative;

    .ant-pro-query-filter {
      padding: 20px 20px 0px 20px;
      .ant-input-affix-wrapper {
        border-radius: 6px;
      }
      .ant-select-selector {
        border-radius: 6px !important;
      }
      .ant-picker-range {
        border-radius: 6px !important;
      }
    }
  }

  .actions {
    margin-bottom: 16px;
  }

  .content {
    box-shadow: 2px 2px 8px 0px rgba(82, 90, 102, 0.08),
      1px 1px 2px 0px rgba(82, 90, 102, 0.04);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    z-index: 8;
    position: relative;

    height: 100%;
    min-height: 0;

    flex: 1;
  }
`;

export default List;
