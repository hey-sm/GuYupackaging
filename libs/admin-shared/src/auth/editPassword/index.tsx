import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  message,
  Modal,
  Space,
  Tooltip,
  Typography,
} from 'antd';

import { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import DraggableModal from '../../components/draggable-modal';
import {
  useCaptchaAdmin,
  useCaptchaVertifyAdmin,
  useSendCodeAdmin,
  useUpdatePasswordAdmin,
} from '../../endpoints';
import { ForgetPwdEditRequest } from '../../model';
import { useAuthStore } from '../auth.store';
import Countdown, { CountdownRef } from './Countdown';
import { Pwd, cPwd } from './rules';
import { useTranslation } from 'react-i18next';

const EditPassword = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [checkShow, setShow] = useState(false);
  const [captchaVisible, setCaptchaVisible] = useState(false);

  const [editForm] = Form.useForm();
  const [form] = Form.useForm();

  const auth = useAuthStore();

  const sendCodeAdmin = useSendCodeAdmin({
    mutation: {
      onSuccess(data, variables, context) {
        if (data?.code !== '200') return;
        countdownRef.current?.start();
      },
    },
  });
  const updatePasswordAdmin = useUpdatePasswordAdmin({
    mutation: {
      onSuccess(data) {
        if (data?.code === '200') {
          form.resetFields();
          setVisible(false);
          message.success(t('header.changeSuccess'));
          auth.logout();
        }
      },
    },
  });
  const captchaVertifyAdmin = useCaptchaVertifyAdmin({
    mutation: {
      onSuccess() {
        editForm.resetFields();
        setIntervalFn();
        setCaptchaVisible(false);
      },
    },
  });

  const setIntervalFn = useCallback(() => {
    sendCodeAdmin.mutate({
      data: { mobile: auth.userInfo?.phone ?? '' },
    });
  }, [auth.userInfo?.phone, sendCodeAdmin]);

  const handleOk = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const data: ForgetPwdEditRequest = {
          // password: values.password || '',
          password: values.confirmPassword || '',
          // verifyCode: values.verifyCode || '',
          // phone: auth.userInfo?.phone || '',
        };
        updatePasswordAdmin.mutate({ data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [form, updatePasswordAdmin]);

  const captchaAdmin = useCaptchaAdmin({
    query: {
      enabled: visible,
      cacheTime: 0,
    },
  });

  const handleCaptcha = () => {
    editForm.validateFields().then((formData) => {
      captchaVertifyAdmin.mutate({
        data: {
          code: formData.code,
          captchaKey: captchaAdmin.data?.data?.captchaKey || '',
        },
      });
    });
  };

  const checkCodeModal = useMemo(
    () => (
      <Modal
        open={checkShow}
        title={false}
        footer={false}
        onCancel={() => {
          setShow(false);
        }}
      >
        <Space>
          <Form.Item>
            <Input maxLength={4} placeholder="请输入验证码" allowClear />
          </Form.Item>
          <Form.Item
            label={
              <Typography.Title level={4} style={{ margin: 0 }} children="" />
            }
          >
            {captchaAdmin.data?.data?.base64Img && (
              <img
                src={captchaAdmin.data?.data?.base64Img}
                style={{ width: 130, height: 48 }}
                alt=""
              />
            )}
          </Form.Item>
          <Form.Item
            label={
              <Typography.Title level={4} style={{ margin: 0 }} children="" />
            }
          >
            <Tooltip title="刷新验证码">
              <Button
                type="text"
                loading={captchaAdmin.isLoading}
                icon={<ReloadOutlined />}
                onClick={() => captchaAdmin.refetch()}
              />
            </Tooltip>
          </Form.Item>
        </Space>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary">确定</Button>
        </div>
      </Modal>
    ),
    [captchaAdmin, checkShow]
  );

  const countdownRef = useRef<CountdownRef>(null);

  return (
    <>
      <div
        onClick={() => {
          setVisible(true);
        }}
      >
        <EditOutlined />
        <span className="ml-2.5">{t('header.changepassword')}</span>
      </div>

      <Modal
        title="请输入图形验证码"
        open={captchaVisible}
        onOk={handleCaptcha}
        onCancel={() => setCaptchaVisible(false)}
      >
        <Form form={editForm} layout="vertical" size="large">
          <ModelCode>
            <Space align="end">
              <Form.Item
                label="验证码"
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
                style={{ margin: 0 }}
              >
                <Input maxLength={4} placeholder="请输入验证码" allowClear />
              </Form.Item>
              <Form.Item noStyle>
                {captchaAdmin.data?.data?.base64Img && (
                  <img
                    src={captchaAdmin.data?.data?.base64Img}
                    style={{ width: 130, height: 48 }}
                    alt=""
                  />
                )}
              </Form.Item>
              <Form.Item noStyle>
                <Tooltip title="刷新验证码">
                  <Button
                    type="text"
                    loading={captchaAdmin.isLoading}
                    icon={<ReloadOutlined />}
                    onClick={() => captchaAdmin.refetch()}
                  />
                </Tooltip>
              </Form.Item>
            </Space>
          </ModelCode>
        </Form>
      </Modal>
      <DraggableModal
        title="修改密码"
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        okText="修改密码"
        onOk={handleOk}
        maskClosable={false}
        width={418}
        height={166}
      >
        <ModalContainer>
          <Form form={form} className="irtp_model">
            {/* <Form.Item label="账号">
              <Input
                value={auth.userInfo?.userName || ''}
                disabled
                style={{ width: 300 }}
              />
            </Form.Item> */}
            <div className="irtp_model_small_text">
              <span className="span">*</span>
              <span>新密码</span>
            </div>
            <Form.Item
              name="password"
              rules={[{ validator: Pwd, required: true }]}
            >
              <Input placeholder="新密码" />
            </Form.Item>
            <div className="irtp_model_small_text">
              <span className="span">*</span>
              <span>确认新密码</span>
            </div>
            <Form.Item
              rules={[
                {
                  validator: (rule, value) =>
                    cPwd(rule, value, form.getFieldValue('password')),
                  required: true,
                },
              ]}
              name="confirmPassword"
            >
              <Input placeholder="确认新密码" />
            </Form.Item>
            {/* <Form.Item label="手机号">
              <Input
                disabled
                value={auth.userInfo?.phone}
                style={{ width: 300 }}
              />
            </Form.Item> */}
            {/* <Form.Item label="验证码">
              <Row gutter={12}>
                <Col span={10}>
                  <Form.Item
                    rules={[{ validator: checkCode, required: true }]}
                    name="verifyCode"
                  >
                    <Input placeholder="验证码" style={{ width: 300 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Countdown
                    ref={countdownRef}
                    onClick={() => setCaptchaVisible(true)}
                  />
                </Col>
              </Row>
            </Form.Item> */}
            {checkCodeModal}
          </Form>
        </ModalContainer>
      </DraggableModal>
    </>
  );
};

const ModalContainer = styled.div`
  .ant-form-item-label {
    width: 120px;
    text-align: right;
  }
`;

const ModelCode = styled.div`
  .ant-form-item {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
  }
`;
export default EditPassword;
