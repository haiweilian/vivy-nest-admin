import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { Button, message, Popconfirm } from 'antd'
import Clipboard from 'clipboard'
import prettyBytes from 'pretty-bytes'
import { useEffect, useRef, useState } from 'react'
import { listFile, deleteFile, fileUseOptions } from '@/apis/file'
import type { FileModel } from '@/apis/file'
import UploadForm from './components/UploadForm'
import UploadsForm from './components/UploadsForm'

const File = () => {
  const actionRef = useRef<ActionType>()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadsOpen, setUploadsOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 文件用途选项
   */
  const { data: fileUseData } = useRequest(fileUseOptions)

  /**
   * 删除文件
   * @param fileIds 文件ID
   */
  const handleDelete = async (fileIds: number | string) => {
    await deleteFile(fileIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<FileModel>[] = [
    {
      title: '文件用途',
      dataIndex: 'fileUse',
      valueType: 'select',
      fieldProps: { options: fileUseData },
    },
    {
      title: '文件路径',
      dataIndex: 'fileUrl',
      width: 300,
      ellipsis: true,
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      search: false,
      render: (_, record) => {
        return prettyBytes(record.fileSize)
      },
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
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
        <Button key="copy" type="link" className="copy" data-clipboard-text={record.fileUrl}>
          复制地址
        </Button>,
        <Popconfirm key="delete" title="是否确认删除？" onConfirm={() => handleDelete(record.fileId)}>
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ]

  /**
   * 复制地址
   */
  useEffect(() => {
    const clipboard = new Clipboard('.copy')
    clipboard.on('success', () => {
      message.success('复制成功')
    })
    return () => {
      clipboard.destroy()
    }
  }, [])

  return (
    <>
      <ProTable
        rowKey="fileId"
        headerTitle="文件列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listFile({
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
              key="upload"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setUploadOpen(true)
              }}
            >
              单个上传
            </Button>,
            <Button
              key="uploads"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setUploadsOpen(true)
              }}
            >
              多个上传
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

      <UploadForm open={uploadOpen} onOpenChange={setUploadOpen} onFinish={async () => actionRef.current?.reload()} />

      <UploadsForm
        open={uploadsOpen}
        onOpenChange={setUploadsOpen}
        onFinish={async () => actionRef.current?.reload()}
      />
    </>
  )
}

export default File
