import styled, { css } from 'styled-components';
import ScrollWrapper from '../scroll-wrapper';

export const Wrapper = styled(ScrollWrapper)<{ height?: string }>`
  height: ${(props) => props.height ?? '300px'};
  ${css``};
`;

export const IconWrapper = styled.div`
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  padding: 8px 0;
  margin: 0 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border-radius: 5px;

  > span.anticon {
    transition: font-size 0.3s ease-in-out;
  }

  &:hover {
    background-color: ${(props) => props.theme['@primary-color']};
    color: #fff;
    > span.anticon {
      font-size: 34px !important;
    }
  }
`;
