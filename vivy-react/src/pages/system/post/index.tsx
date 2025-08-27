import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listPost, deletePost } from '@/apis/system/post'
import type { PostModel } from '@/apis/system/post'
import { DictTag } from '@/components/Dict'
import UpdateForm from './components/UpdateForm'

const Post = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>(null)
  const [record, setRecord] = useState<PostModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 删除岗位
   * @param postIds 岗位ID
   */
  const handleDelete = async (postIds: number | string) => {
    await deletePost(postIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<PostModel>[] = [
    {
      title: '岗位编号',
      dataIndex: 'postId',
      search: false,
    },
    {
      title: '岗位名称',
      dataIndex: 'postName',
    },
    {
      title: '岗位编码',
      dataIndex: 'postCode',
    },
    {
      title: '显示顺序',
      dataIndex: 'postSort',
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
        <Access key="update" accessible={hasPermission('system:post:update')}>
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
        <Access key="delete" accessible={hasPermission('system:post:delete')}>
          <Popconfirm title="是否确认删除？" onConfirm={() => handleDelete(record.postId)}>
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
        rowKey="postId"
        headerTitle="岗位列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listPost({
            ...params,
            page: params.current,
            limit: params.pageSize,
          })
          return {
            data: items,
            total: meta.totalItems,
          }
        }}
        toolbar={{
          actions: [
            <Access key="add" accessible={hasPermission('system:post:add')}>
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
            <Access key="delete" accessible={hasPermission('system:post:delete')}>
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

export default Post
