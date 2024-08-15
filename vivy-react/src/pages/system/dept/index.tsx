import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { isEmpty } from 'lodash-es'
import React, { useRef, useState } from 'react'
import { treeDept, deleteDept } from '@/apis/system/dept'
import type { DeptTreeResult } from '@/apis/system/dept'
import { DictTag } from '@/components/Dict'
import { eachTree } from '@/utils/tree'
import UpdateForm from './components/UpdateForm'

const Dept = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<DeptTreeResult>()
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
  const handleDelete = async (deptId: number) => {
    await deleteDept(deptId)
    actionRef.current?.reload()
  }

  /**
   * 处理默认展开
   * @param data 列数据
   */
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>([])
  const handleExpandedRows = (data: DeptTreeResult[]) => {
    const keys: React.Key[] = []
    eachTree<DeptTreeResult>(data, (item) => {
      if (isEmpty(item.children)) {
        item.children = undefined
      } else if (isEmpty(expandedRowKeys)) {
        keys.push(item.deptId)
      }
    })
    if (isEmpty(expandedRowKeys)) {
      setExpandedRowKeys(keys)
    }
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<DeptTreeResult>[] = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
    },
    {
      title: '显示顺序',
      dataIndex: 'deptSort',
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
        <Access key="update" accessible={hasPermission('system:dept:update')}>
          <Button
            type="link"
            onClick={() => {
              setRecord({ ...record, parentId: undefined })
              setUpdateOpen(true)
            }}
          >
            编辑
          </Button>
        </Access>,
        <Access key="delete" accessible={hasPermission('system:dept:delete')}>
          <Popconfirm title="是否确认删除？" onConfirm={() => handleDelete(record.deptId)}>
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
        rowKey="deptId"
        headerTitle="部门列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        search={false}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
        }}
        request={async () => {
          const data = await treeDept()
          handleExpandedRows(data)
          return {
            data,
          }
        }}
        toolbar={{
          actions: [
            <Access key="add" accessible={hasPermission('system:dept:add')}>
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

export default Dept
