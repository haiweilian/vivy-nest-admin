import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components'

const UpdateInfo: React.FC<{ user: UserInfo }> = ({ user }) => {
  return (
    <ProForm
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      submitter={{ resetButtonProps: { style: { marginLeft: '100px' } } }}
      initialValues={user}
    >
      <ProFormText
        label="用户昵称"
        name="nickName"
        placeholder="请输入用户昵称"
        rules={[{ required: true, message: '请输入用户昵称!' }]}
      />
      <ProFormText
        label="手机号码"
        name="phonenumber"
        placeholder="请输入手机号码"
        rules={[{ required: true, message: '请输入手机号码!' }]}
      />
      <ProFormText
        label="用户邮箱"
        name="email"
        placeholder="请输入用户邮箱"
        rules={[{ required: true, message: '请输入用户邮箱!' }]}
      />
      <ProFormRadio.Group
        label="性别"
        name="sex"
        options={[
          { label: '男', value: '1' },
          { label: '女', value: '2' },
        ]}
      />
    </ProForm>
  )
}

export default UpdateInfo
