import { Spin, SpinProps } from 'antd';
import styled from 'styled-components';

export const GlobalSpinner = (props: SpinProps) => {
  return (
    <Container>
      <Spin {...props} />
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default GlobalSpinner;
