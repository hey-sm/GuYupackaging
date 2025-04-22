import produce from 'immer';
import { atom, useAtom } from 'jotai';
import { last, remove } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import { useCurrentMenu } from '../../hooks';
import { SysMenuTreeResponse } from '../../model';

export type TagView = SysMenuTreeResponse & Location & { fullPath?: string };

export const visitedViewsAtom = atom<TagView[]>([]);

export const useTagsView = () => {
  const [visitedViews, setVisitedViews] = useAtom(visitedViewsAtom);

  const addVisitedView = useCallback(
    (view: TagView) => {
      setVisitedViews(
        produce((draft) => {
          if (draft.some((v) => v.path === view.path)) {
            return;
          }

          draft.push(view);
        })
      );
    },
    [setVisitedViews]
  );

  const delVisitedView = useCallback(
    (view: TagView) => {
      const result = visitedViews.filter((v) => v.path !== view.path);
      setVisitedViews(result);
      return result;
    },
    [setVisitedViews, visitedViews]
  );

  const updateVisitedView = useCallback(
    (view: TagView) => {
      setVisitedViews(
        produce((draft) => {
          for (let v of draft) {
            if (v.path === view.path) {
              v = Object.assign(v, view);
              break;
            }
          }
        })
      );
    },
    [setVisitedViews]
  );

  const delOthersViews = useCallback(
    (view: TagView) => {
      setVisitedViews(
        produce((draft) => {
          remove(draft, (v) => v.path !== view.path);
        })
      );
    },
    [setVisitedViews]
  );

  const location = useLocation();

  const currentMenu = useCurrentMenu();

  useEffect(() => {
    if (currentMenu) {
      const current: TagView = {
        ...currentMenu,
        ...location,
      };

      addVisitedView(current);

      for (const tag of visitedViews) {
        if (tag.fullPath !== current.fullPath) {
          updateVisitedView(current);
        }
      }
    }
  }, [addVisitedView, currentMenu, location, updateVisitedView, visitedViews]);

  // TODO 1 addTags
  // TODO 2 moveToCurrentTag
  // TODO 3 refreshSelectedTag
  // TODO 6 closeAllTags

  const navigate = useNavigate();

  const gotoLastView = useCallback(
    (visitedViews: TagView[], view: TagView) => {
      const latestView = last(visitedViews);

      if (latestView) {
        navigate(latestView.fullPath ?? '/');
      } else {
        if (view.path === '/workbench') {
          navigate(view.fullPath ?? '/', { replace: true });
        } else {
          navigate('/');
        }
      }
    },
    [navigate]
  );

  const closeSelectedTag = useCallback(
    (view: TagView) => {
      const visitedViews = delVisitedView(view);
      if (view.pathname === location.pathname) {
        gotoLastView(visitedViews, view);
      }
    },
    [delVisitedView, gotoLastView, location.pathname]
  );

  const closeOthersTags = useCallback(
    (view: TagView) => {
      navigate(view.fullPath ?? '/');
      delOthersViews(view);
    },
    [delOthersViews, navigate]
  );

  return {
    visitedViews,
    addVisitedView,
    delVisitedView,
    delOthersViews,
    closeSelectedTag,
    closeOthersTags,
  };
};
