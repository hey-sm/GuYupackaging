import { Button, Spin } from 'antd';
import { QRCodeCanvas } from 'qrcode.react';
import queryString from 'query-string';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { MaterialShareResponse } from './Share.d';

interface IProps {
  onCancel: () => void;
  businessType:
    | 'material_video'
    | 'material_picture'
    | 'material_content'
    | 'material_file';
  port: 'admin' | 'channel';
  data?: MaterialShareResponse | null;
}

export const Share = ({
  onCancel,
  businessType,
  port,
  data,
}: IProps): React.ReactElement => {
  const previewUrl = useMemo(() => {
    if (data?.h5Address) {
      const h5Address = decodeURIComponent(data?.h5Address);
      const index = h5Address.indexOf('?');
      const url = h5Address.substring(0, index);
      const oldQuery = h5Address.substring(index);

      const query = { ...queryString.parse(oldQuery), preview: 1 };

      return `${url}?${queryString.stringify(query)}`;
    }
    return undefined;
  }, [data?.h5Address]);

  //分享内容布局
  const shareContent = useMemo<React.ReactNode>(() => {
    switch (businessType) {
      //视频分享
      case 'material_video':
        return (
          <ShareVideo className="flex justify-between w-full pl-[90px] pt-[16px] pb-[13px]">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <span className="block text-left">分享二维码：</span>
                {data ? (
                  <QRCodeCanvas
                    value={data?.h5Address as string}
                    className="mt-[16px]"
                    style={{ width: 132.37, height: 132.37 }}
                  />
                ) : null}
              </div>
              <div className="flex flex-col w-full mt-[60px]">
                <span className="block text-left w-full">分享链接：</span>
                <span className="block w-[260px] mt-[14px]">
                  {data?.h5Address}
                </span>
              </div>
            </div>
            <div className="pr-[32px]">
              <span className="block text-left">预览分享内容：</span>
              <div className="w-[375px] h-[812px] mt-[16px] bg-[#E3E4E5] rounded-[15px]">
                <iframe
                  src={previewUrl}
                  className="w-[375px] h-[812px] overflow-hidden"
                  title="preview"
                ></iframe>
              </div>
            </div>
          </ShareVideo>
        );
      //图片分享
      case 'material_picture':
        return (
          <SharePicture className="flex justify-between w-full pl-[90px] pt-[16px] pb-[13px]">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <span className="block text-left">分享二维码：</span>
                {data ? (
                  <QRCodeCanvas
                    value={data?.h5Address as string}
                    className="mt-[16px]"
                    style={{ width: 132.37, height: 132.37 }}
                  />
                ) : null}
              </div>
              <div className="flex flex-col w-full mt-[60px]">
                <span className="block text-left w-full">分享链接：</span>
                <span className="block w-[260px] mt-[14px]">
                  {data?.h5Address}
                </span>
              </div>
            </div>
            <div className="pr-[32px]">
              <span className="block text-left">预览分享内容：</span>
              <div className="w-[375px] h-[812px] mt-[16px] bg-[#E3E4E5] rounded-[15px]">
                <iframe
                  src={previewUrl}
                  className="w-[375px] h-[812px] overflow-hidden"
                  title="preview"
                ></iframe>
              </div>
            </div>
          </SharePicture>
        );
      //图文分享
      case 'material_content':
        return (
          <ShareContent className="flex justify-between w-full pl-[90px] pt-[16px] pb-[13px]">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <span className="block text-left">分享二维码：</span>
                {data ? (
                  <QRCodeCanvas
                    value={data?.h5Address as string}
                    className="mt-[16px]"
                    style={{ width: 132.37, height: 132.37 }}
                  />
                ) : null}
              </div>
              <div className="flex flex-col w-full mt-[60px]">
                <span className="block text-left w-full">分享链接：</span>
                <span className="block w-[260px] mt-[14px]">
                  {data?.h5Address}
                </span>
              </div>
            </div>
            <div className="pr-[32px]">
              <span className="block text-left">预览分享内容：</span>
              <div className="w-[375px] h-[812px] mt-[16px] bg-[#E3E4E5] rounded-[15px]">
                <iframe
                  src={previewUrl}
                  className="w-[375px] h-[812px] overflow-hidden"
                  title="preview"
                ></iframe>
              </div>
            </div>
          </ShareContent>
        );
      //文件分享
      case 'material_file':
        return (
          <ShareFile className="flex flex-col pl-[80px] pb-[40px] mt-[16px]">
            <div className="flex">
              <span className="w-[90px] block text-right">分享二维码：</span>
              <div className="ml-[18px] w-[164px] h-[164px] p-[16px]">
                {data ? (
                  <QRCodeCanvas
                    value={data?.h5Address as string}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : null}
              </div>
            </div>
            <div className="mt-[45px] flex">
              <span className="w-[90px] block text-right">分享链接：</span>
              <span className="w-[400px] block ml-[18px]">
                {data?.h5Address}
              </span>
            </div>
          </ShareFile>
        );
      default:
        return null;
    }
  }, [businessType, data, previewUrl]);

  return (
    <ShareStyled>
      <div className="share-container max-h-[700px] overflow-y-scroll">
        <Spin spinning={!data} size="large">
          {shareContent}
        </Spin>
      </div>

      {port === 'channel' && (
        <div className="flex items-center justify-end py-[12px] border-t-[#EEEEEE] border-t-[1px]">
          <Button
            className="mr-[30px]"
            type="primary"
            onClick={onCancel}
            style={{ width: 76 }}
          >
            确定
          </Button>
        </div>
      )}
    </ShareStyled>
  );
};

const ShareStyled = styled.div`
  .share-container {
    ::-webkit-scrollbar {
      width: 10px;
    }
    ::-webkit-scrollbar-thumb {
      width: 10px;
      background-color: #eeeeee;
      border-radius: 10px;
    }
  }

  iframe {
    width: 100%;
    height: 100%;
    background-color: white;
    border: 1px solid #8a8a8a;
  }
`;

const ShareVideo = styled.div``;

const SharePicture = styled.div``;

const ShareContent = styled.div``;

const ShareFile = styled.div``;

export default Share;
