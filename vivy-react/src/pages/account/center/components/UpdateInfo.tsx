import { ProForm, ProFormText, ProFormRadio } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { App } from 'antd'
import { updateProfile } from '@/apis/system/profile'
import type { ProfileInfoResult, UpdateProfileParams } from '@/apis/system/profile'

const UpdateInfo: React.FC<{ profile: ProfileInfoResult }> = ({ profile }) => {
  const { message } = App.useApp()
  const { loadDict, toSelect } = useModel('dict')
  const sysUserSex = loadDict('sys_user_sex')

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: UpdateProfileParams) => {
    await updateProfile(values)
    message.success('修改成功')
  }

  return (
    <ProForm
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      submitter={{ resetButtonProps: { style: { marginLeft: '100px' } } }}
      initialValues={profile}
      onFinish={handleSubmit}
    >
      <ProFormText
        label="用户昵称"
        name="nickName"
        placeholder="请输入用户昵称"
        rules={[{ required: true, max: 50 }]}
      />
      <ProFormText
        label="手机号码"
        name="phonenumber"
        placeholder="请输入手机号码"
        rules={[{ required: true, max: 11 }]}
      />
      <ProFormText label="用户邮箱" name="email" placeholder="请输入用户邮箱" rules={[{ required: true, max: 50 }]} />
      <ProFormRadio.Group label="性别" name="sex" options={toSelect(sysUserSex)} />
    </ProForm>
  )
}

export default UpdateInfo
