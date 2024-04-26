import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listNotice, deleteNotice } from '@/apis/system/notice'
import type { NoticeModel } from '@/apis/system/notice'
import { DictTag } from '@/components/Dict'
import UpdateForm from './components/UpdateForm'

const Notice = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<NoticeModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNoticeType = loadDict('sys_notice_type')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 删除通知公告
   * @param noticeIds 通知公告ID
   */
  const handleDelete = async (noticeIds: React.Key) => {
    await deleteNotice(noticeIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<NoticeModel>[] = [
    {
      title: '公告ID',
      dataIndex: 'noticeId',
      search: false,
    },
    {
      title: '公告标题',
      dataIndex: 'noticeTitle',
    },
    {
      title: '公告类型',
      dataIndex: 'noticeType',
      valueType: 'select',
      fieldProps: { options: toSelect(sysNoticeType) },
      render: (_, record) => {
        return <DictTag options={sysNoticeType} value={record.noticeType} />
      },
    },
    {
      title: '公告内容',
      dataIndex: 'noticeContent',
      search: false,
    },
    {
      title: '公告状态',
      dataIndex: 'status',
      search: false,
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
        <Access key="update" accessible={hasPermission('system:notice:update')}>
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
        <Access key="delete" accessible={hasPermission('system:notice:delete')}>
          <Popconfirm title="是否确认删除？" onConfirm={() => handleDelete(record.noticeId)}>
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
        rowKey="noticeId"
        headerTitle="通知公告列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listNotice({
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
            <Access key="add" accessible={hasPermission('system:notice:add')}>
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
            <Access key="delete" accessible={hasPermission('system:notice:delete')}>
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

export default Notice
