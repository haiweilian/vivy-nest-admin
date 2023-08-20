import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Popconfirm } from 'antd'
import { saveAs } from 'file-saver'
import React, { useRef, useState } from 'react'
import { listGenTable, deleteGenTable, syncDbTable, downloadCode } from '@/apis/gen/gen'
import type { GenTableModel } from '@/apis/gen/gen'
import ImportModal from './components/ImportModal'
import PreviewModal from './components/PreviewModal'
import UpdateForm from './components/UpdateForm'

const Gen = () => {
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<GenTableModel>()
  const [importOpen, setImportOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 同步表结构
   * @param tableName 表名称
   */
  const handleSync = async (tableName: React.Key) => {
    await syncDbTable(tableName)
  }

  /**
   * 删除记录表
   * @param tableIds 表ID
   */
  const handleDelete = async (tableIds: React.Key) => {
    await deleteGenTable(tableIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 下载代码
   * @param tableName 表名称
   */
  const handleDownload = async (tableName: React.Key) => {
    const { data } = await downloadCode(tableName)
    saveAs(data, `${tableName}.zip`)
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<GenTableModel>[] = [
    {
      title: '表名称',
      dataIndex: 'tableName',
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
    },
    {
      title: '实体',
      dataIndex: 'className',
      search: false,
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
        <Button
          key="preview"
          type="link"
          onClick={() => {
            setRecord(record)
            setPreviewOpen(true)
          }}
        >
          预览
        </Button>,
        <Button
          key="update"
          type="link"
          onClick={() => {
            setRecord(record)
            setUpdateOpen(true)
          }}
        >
          编辑
        </Button>,
        <Popconfirm key="delete" title="是否确认删除？" onConfirm={() => handleDelete(record.tableId)}>
          <Button type="link">删除</Button>
        </Popconfirm>,
        <Popconfirm key="sync" title="是否确认强制同步表结构？" onConfirm={() => handleSync(record.tableName)}>
          <Button type="link">同步</Button>
        </Popconfirm>,
        <Button key="gen" type="link" onClick={() => handleDownload(record.tableName)}>
          生成
        </Button>,
      ],
    },
  ]

  return (
    <>
      <ProTable
        rowKey="tableId"
        headerTitle="生成列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listGenTable({
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
            <Button
              key="gen"
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                setImportOpen(true)
              }}
            >
              导入
            </Button>,
            <Popconfirm
              key="delete"
              title="是否确认删除？"
              disabled={!selectedRowKeys.length}
              onConfirm={() => handleDelete(selectedRowKeys.join(','))}
            >
              <Button icon={<DeleteOutlined />} type="primary" danger disabled={!selectedRowKeys.length}>
                删除
              </Button>
            </Popconfirm>,
          ],
        }}
      />

      <ImportModal
        open={importOpen}
        onOk={() => {
          setImportOpen(false)
          actionRef.current?.reload()
        }}
        onCancel={() => setImportOpen(false)}
      />

      <PreviewModal record={record} open={previewOpen} onCancel={() => setPreviewOpen(false)} />

      <UpdateForm
        record={record}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
    </>
  )
}

export default Gen
