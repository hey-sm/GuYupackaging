// 图片或者pdf展示

import { useLocation ,useNavigate} from 'react-router-dom';
import { Button}from 'antd'
import styled from 'styled-components';
import Image from '../components/Image';
export const Exhibit = () => {
  const location = useLocation();
  const Navigate=useNavigate()
  const path = location.state.URL ?? '';
  return (
    <Container>
      <div className="img ">
        <Image width={'100%'} src={path} />
        <div className='w-full flex  justify-center mt-[25px]'   >
          <Button type="primary" className='w-[160px] h-[100px]'

          onClick={()=>{
            Navigate(-1)
          }}
          >返回</Button>

          </div>
      </div>


    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 700px;
  background: #f6f7f9;
  padding: 12px 0;
  box-sizing: border-box;
  .img {
    width: 1200px;
    background-color: #ffffff;
    margin: 0 auto;
    padding: 30px;
    box-sizing: border-box;
    border-radius: 3px 3px 3px 3px;
  }
`;
