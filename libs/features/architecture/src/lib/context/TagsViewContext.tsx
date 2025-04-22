import produce from 'immer';
import { remove } from 'lodash-es';
import { createContext, ReactNode, useCallback, useState } from 'react';
import { Location } from 'react-router-dom';

export interface ServerRoute {
  id: string;
  code: string;
  name: string;
  path: string;
}

export interface TagView extends Location {
  id: string;
  path: string;
  name?: string;
  code?: string;

  pathname: string;
  search: string;
  fullPath?: string;
}

export interface TagsViewContextValue {
  visitedViews: TagView[];
  addVisitedView: (view: TagView) => void;
  delVisitedView: (view: TagView) => TagView[];
  updateVisitedView: (view: TagView) => void;
  delOthersViews: (view: TagView) => void;
}

export const TagsViewContext = createContext<TagsViewContextValue | undefined>(
  undefined
);

export const TagsViewProvider = ({ children }: { children?: ReactNode }) => {
  const [visitedViews, setVisitedViews] = useState<TagView[]>([]);

  const addVisitedView = useCallback((view: TagView) => {
    setVisitedViews(
      produce((draft) => {
        if (draft.some((v) => v.pathname === view.pathname)) {
          return;
        }

        draft.push(view);
      })
    );
  }, []);

  const delVisitedView = useCallback(
    (view: TagView) => {
      const result = visitedViews.filter((v) => v.pathname !== view.pathname);
      setVisitedViews(result);
      return result;
    },
    [visitedViews]
  );

  const updateVisitedView = useCallback((view: TagView) => {
    setVisitedViews(
      produce((draft) => {
        for (let v of draft) {
          if (v.pathname === view.pathname) {
            v = Object.assign(v, view);
            break;
          }
        }
      })
    );
  }, []);

  const delOthersViews = useCallback((view: TagView) => {
    setVisitedViews(
      produce((draft) => {
        remove(draft, (v) => v.pathname !== view.pathname);
      })
    );
  }, []);

  return (
    <TagsViewContext.Provider
      value={{
        visitedViews,
        addVisitedView,
        delVisitedView,
        updateVisitedView,
        delOthersViews,
      }}
    >
      {children}
    </TagsViewContext.Provider>
  );
};
