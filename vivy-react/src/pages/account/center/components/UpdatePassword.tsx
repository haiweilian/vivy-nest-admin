import { ProForm, ProFormDependency, ProFormInstance, ProFormText } from '@ant-design/pro-components'
import { useRef } from 'react'
import { updatePassword } from '@/apis/system/profile'
import type { UpdatePasswordParams } from '@/apis/system/profile'
import { Message } from '@/components/App'

const UpdatePassword: React.FC = () => {
  const formRef = useRef<ProFormInstance>(null)

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: UpdatePasswordParams) => {
    await updatePassword(values)
    formRef.current?.resetFields()
    Message.success('修改成功')
  }

  return (
    <ProForm
      formRef={formRef}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      submitter={{ resetButtonProps: { style: { marginLeft: '100px' } } }}
      onFinish={handleSubmit}
    >
      <ProFormText.Password
        label="旧密码"
        name="oldPassword"
        placeholder="请输入旧密码"
        rules={[{ required: true, max: 36 }]}
      />
      <ProFormText.Password
        label="新密码"
        name="newPassword"
        placeholder="请输入新密码"
        rules={[{ required: true, max: 36 }]}
      />
      <ProFormDependency name={['newPassword']}>
        {({ newPassword }) => (
          <ProFormText.Password
            label="确认密码"
            name="confirmPassword"
            placeholder="请确认新密码"
            rules={[
              { required: true, max: 36 },
              {
                validator(_, value) {
                  if (value === newPassword) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject(new Error('两次密码输入不匹配'))
                  }
                },
              },
            ]}
          />
        )}
      </ProFormDependency>
    </ProForm>
  )
}

export default UpdatePassword
