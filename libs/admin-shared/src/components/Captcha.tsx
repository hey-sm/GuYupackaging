import { ReloadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Tooltip } from 'antd';
import { useCaptchaAdmin } from '../endpoints/index';

const Captcha = () => {
  const form = Form.useFormInstance();
  const { data, isLoading, refetch } = useCaptchaAdmin({
    query: {
      onSuccess(data) {
        form.setFieldValue('captchaKey', data.data?.captchaKey);
      },
      cacheTime: 0,
    },
  });

  return (
    <Space align="center">
      <Form.Item name="captchaKey" hidden>
        <Input />
      </Form.Item>

      <Form.Item
        label="验证码"
        name="code"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <Input maxLength={4} placeholder="请输入验证码" allowClear />
      </Form.Item>
      {data && (
        <img
          alt="验证码"
          src={data.data?.base64Img || ''}
          style={{ width: 130, height: 48 }}
        />
      )}
      <Tooltip title="刷新验证码">
        <Button
          type="text"
          loading={isLoading}
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
        />
      </Tooltip>
    </Space>
  );
};

export default Captcha;
