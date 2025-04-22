import React from 'react';

export interface ListToolBarProps {
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  description?: React.ReactNode;
  /**
   * 查询区
   */
  search?: React.ReactNode;
  /**
   * 操作区
   */
  actions?: React.ReactNode;
  /**
   * 设置区
   */
  settings?: React.ReactNode;
  filter?: React.ReactNode;
}
