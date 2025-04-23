import { CloseSmall } from '@icon-park/react';
import { useAuthStore } from '../../auth/auth.store';
import { Tabs } from 'antd';
import { Tab } from 'rc-tabs/lib/interface';
import { useCallback, useMemo } from 'react';
import { useAliveController } from 'react-activation';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCurrentMenu } from '../../hooks';
import { TagView, useTagsView } from './useTagsView';

export const TagsView = () => {
  const { visitedViews, closeSelectedTag } = useTagsView();
  const infoList = useAuthStore((state) => state.infoList);
  const currentMenu = useCurrentMenu();

  // const hasHome = useMemo(
  //   () => visitedViews.some((v) => v.path === '/workbench'),
  //   [visitedViews]
  // );
  const navigate = useNavigate();

  const items: Tab[] = visitedViews
    .map((v, i) => {
      // const isHome = v.path === '/workbench';
      const closable = !(v.path === '/workbench');
      const label = v.search.indexOf('audit') !== -1 ? '审核' : v.name;
      const item: Tab = {
        key: v.path || v.pathname,
        label: label,
        closable,
        closeIcon: (
          <CloseSmall
            theme="outline"
            size="18"
            fill="#C4C4C4"
            className="flex"
          />
        ),
      };
      return item;
    })
    .filter((v) => !!v.key);

  const handleChange = useCallback(
    (key: string) => {
      const info = (infoList ?? []).find((item: any) => item?.path === key);
      if (info) {
        const mode = info?.state?.mode === 'audit' ? '?type=audit' : '';
        navigate(key + mode, { replace: true, state: { ...info.state } });
      } else {
        navigate({ pathname: key }, { replace: true });
      }
    },
    [navigate]
  );

  const controller = useAliveController();
  const onEdit = useCallback(
    (targetKey: any, action: 'add' | 'remove') => {
      if (action === 'remove') {
        const view = visitedViews.find((v) => v.path === targetKey) as TagView;

        closeSelectedTag(view);

        view.pathname && controller.drop(view.pathname);
      }
    },
    [closeSelectedTag, controller, visitedViews]
  );

  return (
    <Container
      className="
      shadow-[2px_2px_8px_0_rgba(0,0,0,0.25),1px_1px_2px_0_rgba(82,90,102,0.04)]
    dark:shadow-[2px_2px_8px_0_rgba(210,210,210,1.08),1px_1px_2px_0_rgba(210,210,210,1.04)]
    "
    >
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={currentMenu?.path}
        items={items}
        onChange={handleChange}
        onEdit={onEdit}
        tabBarGutter={0}
      />
    </Container>
  );
};

const Container = styled.div`
  /* background-color: #fff; */
  padding: 0 20px;
  height: 60px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-width: 0;

  .ant-tabs {
    flex: 1;
    min-width: 0;
    color: #4e5969;
  }

  .ant-tabs-tab-remove {
    margin-left: 4px;
  }

  .ant-tabs-nav {
    margin-bottom: 0;
    &::before {
      border: 0;
    }

    .ant-tabs-nav-list {
      display: flex;
      align-items: center;
    }

    .ant-tabs-tab {
      border: 0;
      background-color: #fff;
      font-size: 16px;
      height: 40px;
      padding: 7px 20px;
      transition: none;

      &:hover {
        color: rgb(var(--color-primary));
      }

      .ant-tabs-tab-btn {
        transition: none;
      }

      &.ant-tabs-tab-active {
        font-weight: bold;
        .ant-tabs-tab-btn {
          color: rgb(var(--color-primary));
          text-shadow: none;
          transition: none;
        }
      }
    }

    .ant-tabs-tab-active {
      background-color: #f7f8fa;
      border-radius: 30px !important;
      border: 0 !important;
    }
  }
`;

export default TagsView;
