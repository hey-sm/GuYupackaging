import 'react-quill/dist/quill.snow.css';

// 财务模块
import {
  AppLayout,
  Login,
  ProtectedRoute,
  Exhibit,
  Invoice,
} from '@org/admin-shared';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { Admin } from '@org/features/architecture';

import moment from 'moment';
import { AliveScope } from 'react-activation';
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';
import 'moment/dist/locale/zh-cn';

import { AliyunOSSProvider } from '@org/shared';
import { authProvider } from './authProvider';

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
        element: (
          <div className="w-full h-full flex items-center justify-center text-[36px]">
            欢迎来到包装材料平台
          </div>
        ),
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
  return (
    <AliyunOSSProvider config={aliyunOSSConfig}>
      <AliveScope>
        <ConfigProvider locale={zhCN}>
          <Admin authProvider={authProvider} resources={[]}>
            <RouterProvider router={router} />
          </Admin>
        </ConfigProvider>
      </AliveScope>
    </AliyunOSSProvider>
  );
}

export default App;
