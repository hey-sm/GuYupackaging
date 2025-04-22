import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { UploadFile } from 'antd';
import { useState } from 'react';
import { FileUpload } from './FileUpload';

const Story: ComponentMeta<typeof FileUpload> = {
  component: FileUpload,
  title: 'FileUpload',
};
export default Story;

const Template: ComponentStory<typeof FileUpload> = (args) => {
  const [images, setImages] = useState<UploadFile[]>([]);
  return <FileUpload {...args} value={images} onChange={setImages} />;
};

export const MockSenderEnhancer = Template.bind({});

MockSenderEnhancer.args = {
  multiple: true,
  signature: {
    url: 'http://irtp-trade-dev.qimoyun.com/api/base/ofile/resource/signature',
    params: {
      product: 'smartdms',
    },
  },
};
