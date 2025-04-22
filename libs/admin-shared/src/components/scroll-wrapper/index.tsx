import { debounce } from 'lodash-es';
import ScrollBar, { ScrollValues } from 'rc-scrollbars';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  > div > div:not(:first-child) {
    z-index: 3 !important;
  }
  .scroll-content {
    padding-right: 16px;
  }
`;

export interface ScrollWrapperProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  onScroll?: (v: ScrollValues) => void;
  onLayout?: (v: ScrollValues) => void;
}

export const ScrollWrapper = React.forwardRef<ScrollBar, ScrollWrapperProps>(
  ({ style, className, children, onScroll, onLayout }, ref) => {
    const timer = React.useRef<number>();
    const init = React.useRef(true);

    const handleScroll = useMemo(
      () =>
        debounce((e: any) => {
          const scrollLeft = e.target.scrollLeft;
          const scrollTop = e.target.scrollTop;
          const scrollWidth = e.target.scrollWidth;
          const scrollHeight = e.target.scrollHeight;
          const clientWidth = e.target.clientWidth;
          const clientHeight = e.target.clientHeight;
          const scrollValues: ScrollValues = {
            left: scrollLeft / (scrollWidth - clientWidth) || 0,
            top: scrollTop / (scrollHeight - clientHeight) || 0,
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight,
          };
          if (onScroll) {
            onScroll(scrollValues);
          }
        }, 300),
      [onScroll]
    );

    const doLayout = () => {
      if (init.current) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          const scrollValues = (ref as any).current?.getValues();
          onLayout?.(scrollValues);
          init.current = false;
        }, 1000);
      }
    };

    if (onLayout) doLayout();

    return (
      <Wrapper style={style} className={className}>
        <ScrollBar ref={ref} onScroll={handleScroll}>
          <div className="scroll-content">{children}</div>
        </ScrollBar>
      </Wrapper>
    );
  }
);

export default ScrollWrapper;
