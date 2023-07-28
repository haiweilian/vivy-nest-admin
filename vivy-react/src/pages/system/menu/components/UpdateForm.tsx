import { AppstoreOutlined } from '@ant-design/icons'
import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormDigit,
  ProFormTreeSelect,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { useRef, useEffect } from 'react'
import { addMenu, updateMenu, infoMenu, selectableMenu } from '@/apis/system/menu'
import type { MenuTreeVo } from '@/apis/types/system/menu'
import { IconPicker } from '@/components/Icon'

type MenuType = { label: string; value: 'M' | 'C' | 'F' }
const menuTypeOptions: MenuType[] = [
  { label: '目录', value: 'M' },
  { label: '菜单', value: 'C' },
  { label: '按钮', value: 'F' },
]

interface UpdateFormProps extends DrawerFormProps {
  record: Nullable<MenuTreeVo>
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 注册字典数据
   */
  const { selectDict } = useModel('dict')
  const sysYesNo = selectDict('sys_yes_no')
  const sysNormalDisable = selectDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  useEffect(() => {
    formRef.current?.resetFields()
    if (record) {
      infoMenu(record.menuId).then((info) => {
        formRef.current?.setFieldsValue({
          ...info,
          parentId: info.parentId || undefined,
        })
      })
    }
  }, [record])

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: Recordable) => {
    if (record) {
      await updateMenu({
        ...values,
        menuId: record.menuId,
      })
    } else {
      await addMenu(values)
    }
    formRef.current?.resetFields()
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `编辑菜单-${record.menuName}` : `新增菜单`}
      onFinish={async (values) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
    >
      <ProFormTreeSelect
        name="parentId"
        label="上级菜单"
        request={selectableMenu}
        fieldProps={{
          fieldNames: { label: 'menuName', value: 'menuId' },
        }}
      />
      <ProFormRadio.Group
        name="menuType"
        label="菜单类型"
        rules={[{ required: true }]}
        radioType="button"
        fieldProps={{
          options: menuTypeOptions,
        }}
      />
      <ProFormText name="menuName" label="菜单名称" rules={[{ required: true }]} />
      <ProFormDigit name="menuSort" label="显示顺序" fieldProps={{ min: 0, precision: 0 }} />
      <ProFormDependency name={['menuType']}>
        {({ menuType }: Record<string, MenuType['value']>) => (
          <>
            {/* 目录、菜单 */}
            {menuType === 'M' || menuType === 'C' ? (
              <ProFormText
                name="icon"
                label="菜单图标"
                fieldProps={{
                  addonBefore: (
                    <IconPicker
                      onChange={(value) => {
                        formRef.current?.setFieldValue('icon', value)
                      }}
                    >
                      <AppstoreOutlined />
                    </IconPicker>
                  ),
                }}
              />
            ) : null}
            {/* 目录、菜单 */}
            {menuType === 'M' || menuType === 'C' ? (
              <ProFormText
                name="path"
                label="路由地址"
                tooltip="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormText
                name="component"
                label="组件路径"
                tooltip="访问的组件路径，如：`system/user/index`，默认在`pages`目录下"
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormText
                name="query"
                label="路由参数"
                tooltip='访问路由的默认传递参数，如：`{"id": 1, "name": "vivy"}`'
              />
            ) : null}
            {/* 菜单、按钮 */}
            {menuType === 'C' || menuType === 'F' ? (
              <ProFormText
                name="permission"
                label="权限字符"
                tooltip="控制器中定义的权限字符，如：@RequirePermissions('system:operlog:remove')"
              />
            ) : null}
            {/* 目录、菜单 */}
            {menuType === 'M' || menuType === 'C' ? (
              <ProFormRadio.Group
                name="isVisible"
                label="是否显示"
                tooltip="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                initialValue={'0'}
                fieldProps={{ options: sysYesNo }}
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormRadio.Group
                name="isLink"
                label="是否外链"
                tooltip="选择是外链则路由地址需要以`http(s)://`开头"
                initialValue={'1'}
                fieldProps={{ options: sysYesNo }}
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormRadio.Group
                name="isFrame"
                label="是否内嵌"
                tooltip="选择是内嵌则路由地址需要以`http(s)://`开头"
                initialValue={'1'}
                fieldProps={{ options: sysYesNo }}
              />
            ) : null}
            {/* 菜单 */}
            {menuType === 'C' ? (
              <ProFormRadio.Group
                name="isCache"
                label="是否缓存"
                tooltip="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                initialValue={'1'}
                fieldProps={{ options: sysYesNo }}
              />
            ) : null}
          </>
        )}
      </ProFormDependency>
      <ProFormRadio.Group name="status" label="状态" initialValue={'0'} fieldProps={{ options: sysNormalDisable }} />
    </DrawerForm>
  )
}

export default UpdateForm
