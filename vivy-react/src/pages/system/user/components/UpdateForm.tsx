import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormTreeSelect,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { useRef } from 'react'
import { configValue } from '@/apis/system/config'
import { deptTreeOptions } from '@/apis/system/dept'
import { postOptions } from '@/apis/system/post'
import { roleOptions } from '@/apis/system/role'
import { addUser, updateUser, infoUser } from '@/apis/system/user'
import type { CreateUserParams, UserModel } from '@/apis/system/user'

interface UpdateFormProps extends DrawerFormProps {
  record?: UserModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>(null)

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysUserSex = loadDict('sys_user_sex')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoUser } = useRequest(infoUser, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const { run: runInitPassword } = useRequest(() => configValue('sys.user.initPassword'), {
    manual: true,
    onSuccess(password) {
      formRef.current?.setFieldsValue({ password })
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    if (record) {
      runInfoUser(record.userId)
    } else {
      runInitPassword()
    }
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateUserParams) => {
    if (record) {
      await updateUser(record.userId, values)
    } else {
      await addUser(values)
    }
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `编辑用户` : `新增用户`}
      onFinish={async (values: any) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
      onOpenChange={(open) => {
        open && handleInitial()
        props.onOpenChange?.(open)
      }}
    >
      <ProFormText name="nickName" label="用户昵称" rules={[{ required: true, max: 50 }]} />
      <ProFormText name="userName" label="用户名称" rules={[{ required: true, max: 50 }]} />
      {record ? null : <ProFormText.Password name="password" label="用户密码" rules={[{ required: true, max: 36 }]} />}
      <ProFormTreeSelect
        name="deptId"
        label="归属部门"
        request={deptTreeOptions}
        fieldProps={{
          fieldNames: { label: 'deptName', value: 'deptId' },
        }}
      />
      <ProFormText name="phonenumber" label="手机号码" rules={[{ max: 11 }]} />
      <ProFormText name="email" label="邮箱" rules={[{ max: 50 }]} />
      <ProFormSelect name="sex" label="用户性别" fieldProps={{ options: toSelect(sysUserSex) }} />
      <ProFormRadio.Group
        name="status"
        label="状态"
        initialValue={'0'}
        fieldProps={{ options: toSelect(sysNormalDisable) }}
      />
      <ProFormSelect
        name="roleIds"
        label="角色"
        request={roleOptions}
        fieldProps={{
          mode: 'multiple',
          fieldNames: { label: 'roleName', value: 'roleId' },
        }}
      />
      <ProFormSelect
        name="postIds"
        label="岗位"
        request={postOptions}
        fieldProps={{
          mode: 'multiple',
          fieldNames: { label: 'postName', value: 'postId' },
        }}
      />
    </DrawerForm>
  )
}

export default UpdateForm
