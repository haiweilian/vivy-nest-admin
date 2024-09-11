import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { TreeSelect } from 'antd'
import { useRef } from 'react'
import { menuTreeOptions } from '@/apis/system/menu'
import { addRole, updateRole, infoRole } from '@/apis/system/role'
import type { CreateRoleParams, RoleModel } from '@/apis/system/role'

interface UpdateFormProps extends DrawerFormProps {
  record?: RoleModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoRole } = useRequest(infoRole, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoRole(record.roleId)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateRoleParams) => {
    if (record) {
      await updateRole(record.roleId, values)
    } else {
      await addRole(values)
    }
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `编辑角色` : `新增角色`}
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
      <ProFormText name="roleName" label="角色名称" rules={[{ required: true, max: 50 }]} />
      <ProFormText name="roleCode" label="权限字符" rules={[{ required: true, max: 50 }]} />
      <ProFormDigit name="roleSort" label="显示顺序" fieldProps={{ min: 0, precision: 0 }} />
      <ProFormRadio.Group
        name="status"
        label="状态"
        initialValue={'0'}
        fieldProps={{ options: toSelect(sysNormalDisable) }}
      />
      <ProFormTreeSelect
        name="menuIds"
        label="菜单权限"
        request={menuTreeOptions}
        fieldProps={{
          fieldNames: { label: 'menuName', value: 'menuId' },
          maxTagCount: 3,
          treeCheckable: true,
          treeCheckStrictly: true,
          showCheckedStrategy: TreeSelect.SHOW_ALL,
        }}
      />
    </DrawerForm>
  )
}

export default UpdateForm
