import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { isEmpty } from 'lodash-es'
import { useRef, useState } from 'react'
import { treeMenu, deleteMenu } from '@/apis/system/menu'
import type { MenuTreeResult } from '@/apis/system/menu'
import { DictTag } from '@/components/Dict'
import { getIcon } from '@/components/Icon'
import { eachTree } from '@/utils/tree'
import UpdateForm from './components/UpdateForm'

const Menu = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<MenuTreeResult>()
  const [updateOpen, setUpdateOpen] = useState(false)

  /**
   * 注册字典数据
   */
  const { loadDict } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 删除部门
   * @param deptId 部门ID
   */
  const handleDelete = async (deptId: React.Key) => {
    await deleteMenu(deptId)
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<MenuTreeResult>[] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      render: (node, record) => {
        if (record.icon) {
          return getIcon(record.icon)
        } else {
          return node
        }
      },
    },
    {
      title: '显示顺序',
      dataIndex: 'menuSort',
    },
    {
      title: '权限标识',
      dataIndex: 'permission',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => {
        return <DictTag options={sysNormalDisable} value={record.status} />
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Access key="update" accessible={hasPermission('system:menu:update')}>
          <Button
            type="link"
            onClick={() => {
              setRecord(record)
              setUpdateOpen(true)
            }}
          >
            编辑
          </Button>
        </Access>,
        <Access key="delete" accessible={hasPermission('system:menu:delete')}>
          <Popconfirm title="是否确认删除？" onConfirm={() => handleDelete(record.menuId)}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Access>,
      ],
    },
  ]

  return (
    <>
      <ProTable
        rowKey="menuId"
        headerTitle="菜单列表"
        bordered
        search={false}
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          const data = await treeMenu()
          eachTree<MenuTreeResult>(data, (item) => {
            if (isEmpty(item.children)) item.children = undefined
          })
          return {
            data,
          }
        }}
        toolbar={{
          actions: [
            <Access key="add" accessible={hasPermission('system:menu:add')}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setRecord(undefined)
                  setUpdateOpen(true)
                }}
              >
                新增
              </Button>
            </Access>,
          ],
        }}
      />

      <UpdateForm
        record={record}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
    </>
  )
}

export default Menu
