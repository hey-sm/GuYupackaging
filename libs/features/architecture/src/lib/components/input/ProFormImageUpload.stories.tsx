import type { ComponentStory, ComponentMeta } from '@storybook/react';
import qs from 'query-string';
import { ProFormImageUpload } from './ProFormImageUpload';

const Story: ComponentMeta<typeof ProFormImageUpload> = {
  component: ProFormImageUpload,
  title: 'ProFormImageUpload',
};
export default Story;

const Template: ComponentStory<typeof ProFormImageUpload> = (args) => (
  <ProFormImageUpload {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  name: 'image',
  label: 'Image',
  max: 9,
  value: [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ],
  getOSSConfig() {
    return fetch(
      `http://irtp-trade-dev.qimoyun.com/api/base/ofile/resource/signature?${qs.stringify(
        {
          product: 'smartdms',
        }
      )}`,
      {
        method: 'GET',
      }
    ).then((response) => response.json());
  },
};
