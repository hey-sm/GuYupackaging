
import { Button } from 'antd';
import { useMemo } from 'react';
import {useLocation,useNavigate}from 'react-router-dom';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';

export const Invoice = () => {
  const { height, width } =useWindowSize();
  const location=useLocation();

  const iframeStyle = useMemo(()=>({width, height}),[height, width])

  const Navigate=useNavigate()
  const path = location.state.URL ?? '';

  return (
    <InvoiceBody>
      <Container>
        <div className="invoice">
          <div className='flex ju'>
            <Button type="primary" className='w-[160px] h-[100px] mb-4'
            onClick={()=>{
              Navigate(-1)
            }}
            >返回</Button>
          </div>
          <iframe style={iframeStyle} src={path}></iframe>
        </div>
      </Container>
    </InvoiceBody>
  );
};

const InvoiceBody = styled.div`
  width: 100%;
  background-color: #f6f7f9;
  padding: 20px;
  box-sizing: border-box;
`;

const Container = styled.div`
  width: 1200px;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 3px 3px 3px 3px;
  .invoice {
    width: 1200px;
  }
`;

