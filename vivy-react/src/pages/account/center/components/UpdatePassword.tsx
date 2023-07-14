import { ProForm, ProFormText } from '@ant-design/pro-components';

const UpdatePassword: React.FC = () => {
  return (
    <ProForm
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      submitter={{ resetButtonProps: { style: { marginLeft: '100px' } } }}
    >
      <ProFormText.Password
        label="旧密码"
        name="oldPassword"
        placeholder="请输入旧密码"
        rules={[{ required: true, message: '请输入旧密码!' }]}
      />
      <ProFormText.Password
        label="新密码"
        name="newPassword"
        placeholder="请输入新密码"
        rules={[{ required: true, message: '请输入新密码!' }]}
      />
      <ProFormText.Password
        label="确认密码"
        name="confirmPassword"
        placeholder="请确认新密码"
        rules={[{ required: true, message: '请确认新密码!' }]}
      />
    </ProForm>
  );
};

export default UpdatePassword;
