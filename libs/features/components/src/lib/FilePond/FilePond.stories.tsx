import { getMockSenderEnhancer } from '@rpldy/mock-sender';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
import { FilePond } from './FilePond';
import { FileItem } from './types';

const Story: ComponentMeta<typeof FilePond> = {
  component: FilePond,
  title: 'FilePond',
};
export default Story;

const Template: ComponentStory<typeof FilePond> = (args) => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'hello',
      url: 'https://xximg1.meitudata.com/qjZjRkDh68Ybw8gOy1oXCWwexNP2oj.jpg?imageView2/0/w/900',
    },
  ]);

  return (
    <FilePond
      {...args}
      className="w-[400px]"
      files={files}
      onUpdateFiles={setFiles}
    />
  );
};

export const MockSenderEnhancer = Template.bind({});

const mockSenderEnhancer = getMockSenderEnhancer({
  delay: 3500,
  progressIntervals: [20, 40, 75, 80, 90, 99],
});

MockSenderEnhancer.args = {
  enhancer: mockSenderEnhancer,
  maxFiles: 3,
  validateType: {
    acceptedFileTypes: [
      'video/avi',
      'video/mp4',
      'video/m4v',
      'video/flv',
      'video/f4v',
      'video/rmvb',
      'video/mov',
    ],
  },
  imagePreview: {},
  signature: {
    url: 'http://irtp-trade-dev.qimoyun.com/api/base/ofile/resource/signature',
    params: {
      product: 'smartdms',
    },
  },
};
