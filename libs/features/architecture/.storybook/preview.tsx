// .storybook/preview.tsx
import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Admin } from '../src';
import React from 'react';

const queryClient = new QueryClient();

const preview: Preview = {
  decorators: [
    withRouter, // 直接使用，不需要类型断言
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
    (Story) => (
      <Admin
        resources={[
          {
            name: 'posts',
            async getList(params) {
              const response = await fetch('http://localhost:4400/posts', {
                method: 'GET',
              });
              return response.json();
            },
            // 其他CRUD方法保持不变...
          },
        ]}
      >
        <Story />
      </Admin>
    ),
  ],
};

export default preview;
