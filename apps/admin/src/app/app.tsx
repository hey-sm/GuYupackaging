import 'react-quill/dist/quill.snow.css';
import {
  AppLayout,
  Login,
  ProtectedRoute,
  Exhibit,
  Invoice,
} from '@org/admin-shared';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Admin } from '@org/features/architecture';

import moment from 'moment';
import { AliveScope } from 'react-activation';
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import 'moment/dist/locale/zh-cn';

import { AliyunOSSProvider, useTheme } from '@org/shared';
import { authProvider } from './authProvider';
import { Workbench } from '@org/admin-modules';

moment.locale('zh-cn');

const aliyunOSSConfig = {
  uri: import.meta.env.VITE_FILE_URL,
  params: {
    product: 'smartdms',
  },
};

const router = createHashRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/workbench" replace /> },
      {
        path: 'workbench',
        element: <Workbench />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/exhibit',
    element: <Exhibit />,
  },
  {
    // Invoice
    path: '/Invoice',
    element: <Invoice />,
  },
  { path: '*', element: <div>404</div> },
]);

export function App() {
  const { theme } = useTheme();
  return (
    <AliyunOSSProvider config={aliyunOSSConfig}>
      <AliveScope>
        <ConfigProvider
          locale={zhCN}
          theme={{
            cssVar: true,
            algorithm:
              theme === 'dark'
                ? AntdTheme.darkAlgorithm
                : AntdTheme.defaultAlgorithm,
          }}
        >
          <Admin authProvider={authProvider} resources={[]}>
            <RouterProvider router={router} />
          </Admin>
        </ConfigProvider>
      </AliveScope>
    </AliyunOSSProvider>
  );
}

export default App;
