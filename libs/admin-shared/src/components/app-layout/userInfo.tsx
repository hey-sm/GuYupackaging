import { Card, Descriptions } from 'antd';
import { useGetIdentity } from '@org/features/architecture';
import { useState } from 'react';
import DraggableModal from '../draggable-modal';

const { Item } = Descriptions;
const UserInfoModal = () => {
  const { data: userInfo } = useGetIdentity();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <span
        onClick={() => {
          setVisible(true);
        }}
      >
        个人信息
      </span>
      <DraggableModal
        title="个人信息"
        // width="80%"
        height={420}
        open={visible}
        footer={false}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Card title="个人信息">
          <Descriptions column={4}>
            <Item label="编码">{userInfo?.userCode}</Item>
            <Item label="姓名">{userInfo?.name}</Item>
            <Item label="性别">{userInfo?.sexDesc}</Item>
            <Item label="电话">{userInfo?.phone}</Item>
          </Descriptions>
        </Card>
        <Card style={{ marginTop: 20 }} title="岗位信息">
          <Descriptions column={1}>
            <Item label="所属销售组织">{userInfo?.orgName}</Item>
            <Item label="岗位">{userInfo?.postName}</Item>
          </Descriptions>
        </Card>
      </DraggableModal>
    </>
  );
};
export default UserInfoModal;
