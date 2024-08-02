import { PlusOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { useRequest, useModel, Access, useAccess } from '@umijs/max'
import type { TreeProps, TreeDataNode } from 'antd'
import { Tree, Button, Popconfirm } from 'antd'
import { saveAs } from 'file-saver'
import { isEmpty } from 'lodash-es'
import React, { useRef, useState } from 'react'
import { deptTreeOptions } from '@/apis/system/dept'
import type { DeptTreeResult } from '@/apis/system/dept'
import { listUser, deleteUser, exportUserList } from '@/apis/system/user'
import type { UserModel } from '@/apis/system/user'
import { DictTag } from '@/components/Dict'
import { eachTree } from '@/utils/tree'
import ImportForm from './components/ImportForm'
import UpdateForm from './components/UpdateForm'

const User = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<UserModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
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
  const { data: deptData } = useRequest(deptTreeOptions, {
    onSuccess(data) {
      const keys: React.Key[] = []
      eachTree<DeptTreeResult>(data, (item) => {
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
   * 导出用户列表
   */
  const { loading: loadingExport, run: runExportUserList } = useRequest(exportUserList, {
    manual: true,
    onSuccess({ data }) {
      saveAs(data, `用户列表.xlsx`)
    },
  })

  /**
   * 表格列配置
   */
  const columns: ProColumns<UserModel>[] = [
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
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Access key="admin" accessible={record.userId !== 1}>
          <Access key="update" accessible={hasPermission('system:user:update')}>
            <Button
              type="link"
              onClick={() => {
                setRecord(record)
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
                    setRecord(undefined)
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
                  loading={loadingExport}
                  onClick={() => {
                    runExportUserList()
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
        record={record}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onFinish={async () => actionRef.current?.reload()}
      />

      <ImportForm
        // record={record}
        open={importOpen}
        onOpenChange={setImportOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
    </>
  )
}

export default User
