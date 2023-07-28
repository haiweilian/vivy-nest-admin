import { PlusOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { useRequest, useModel, Access, useAccess } from '@umijs/max'
import type { TreeProps, TreeDataNode } from 'antd'
import { Tree, Button, Popconfirm } from 'antd'
import { isEmpty } from 'lodash-es'
import React, { useRef, useState } from 'react'
import { selectableDept } from '@/apis/system/dept'
import { listUser, deleteUser } from '@/apis/system/user'
import type { DeptTreeVo } from '@/apis/types/system/dept'
import type { SysUser } from '@/apis/types/system/user'
import { DictTag } from '@/components/Dict'
import { eachTree } from '@/utils/tree'
import ImportForm from './components/ImportForm'
import UpdateForm from './components/UpdateForm'

const User = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [recordData, setRecordData] = useState<Nullable<SysUser>>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 部门树选择
   */
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [selectedDeptKeys, setSelectedDeptKeys] = useState<React.Key[]>([])
  const onDeptSelect: TreeProps['onSelect'] = (selectedKeys) => {
    setSelectedDeptKeys(selectedKeys)
    actionRef.current?.reload()
  }
  const { data: deptData } = useRequest(selectableDept, {
    onSuccess(data) {
      const keys: React.Key[] = []
      eachTree<DeptTreeVo>(data, (item) => {
        if (!isEmpty(item.children)) {
          keys.push(item.deptId)
        }
      })
      setExpandedKeys(keys)
    },
  })

  /**
   * 删除用户
   * @param userIds 用户ID
   */
  const handleDelete = async (userIds: React.Key) => {
    await deleteUser(userIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<SysUser>[] = [
    {
      title: '用户编号',
      dataIndex: 'userId',
      search: false,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { options: toSelect(sysNormalDisable) },
      render: (_, record) => {
        return <DictTag options={sysNormalDisable} value={record.status} />
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Access key="admin" accessible={record.userId !== 1}>
          <Access key="update" accessible={hasPermission('system:user:update')}>
            <Button
              type="link"
              onClick={() => {
                setRecordData(record)
                setUpdateOpen(true)
              }}
            >
              编辑
            </Button>
          </Access>
          <Access key="delete" accessible={hasPermission('system:user:delete')}>
            <Popconfirm title="是否确认删除？" onConfirm={() => handleDelete(record.userId)}>
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Access>
        </Access>,
      ],
    },
  ]

  return (
    <>
      <div className="flex h-full">
        <Tree
          className="w-[250px] pt-2 pb-2"
          onSelect={onDeptSelect}
          treeData={deptData as unknown as TreeDataNode[]}
          fieldNames={{ key: 'deptId', title: 'deptName' }}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
        />
        <ProTable
          className="flex-1 pl-4"
          rowKey="userId"
          headerTitle="用户列表"
          bordered
          columns={columns}
          actionRef={actionRef}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps(record) {
              return {
                disabled: record.userId === 1,
              }
            },
          }}
          request={async (params) => {
            const { items, meta } = await listUser({
              ...params,
              page: params.current,
              limit: params.pageSize,
              deptId: selectedDeptKeys[0] as number,
            })
            return {
              data: items,
              total: meta.totalItems,
            }
          }}
          toolbar={{
            actions: [
              <Access key="add" accessible={hasPermission('system:user:add')}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setRecordData(null)
                    setUpdateOpen(true)
                  }}
                >
                  新增
                </Button>
              </Access>,
              <Access key="delete" accessible={hasPermission('system:user:delete')}>
                <Popconfirm
                  title="是否确认删除？"
                  disabled={!selectedRowKeys.length}
                  onConfirm={() => handleDelete(selectedRowKeys.join(','))}
                >
                  <Button icon={<DeleteOutlined />} type="primary" danger disabled={!selectedRowKeys.length}>
                    删除
                  </Button>
                </Popconfirm>
              </Access>,
              <Access key="import" accessible={hasPermission('system:user:import')}>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => {
                    setImportOpen(true)
                  }}
                >
                  导入
                </Button>
              </Access>,
              <Access key="export" accessible={hasPermission('system:user:export')}>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    setImportOpen(true)
                  }}
                >
                  导出
                </Button>
              </Access>,
            ],
          }}
        />
      </div>
      <UpdateForm
        record={recordData}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
      <ImportForm open={importOpen} onOpenChange={setImportOpen} onFinish={async () => actionRef.current?.reload()} />
    </>
  )
}

export default User
