import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Modal, ModalProps } from 'antd'
import { useRef, useState } from 'react'
import { listDbTable, importDbTable } from '@/apis/gen/gen'
import type { GenTableModel } from '@/apis/gen/gen'

const ImportModal: React.FC<ModalProps> = (props) => {
  const actionRef = useRef<ActionType>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 提交导入
   */
  const [confirmLoading, setConfirmLoading] = useState(false)
  const handleSubmit = async (e: any) => {
    if (!selectedRowKeys.length) return

    setConfirmLoading(true)
    await importDbTable(selectedRowKeys.join(','))
    setConfirmLoading(false)

    setSelectedRowKeys([])
    props.onOk?.(e)
    actionRef.current?.reload()
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
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
    },
  ]

  return (
    <Modal {...props} title="导入列表" width={1000} confirmLoading={confirmLoading} onOk={handleSubmit}>
      <ProTable
        rowKey="tableName"
        bordered
        toolBarRender={false}
        columns={columns}
        actionRef={actionRef}
        pagination={{ pageSize: 8 }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const items = await listDbTable({
            tableName: params.tableName,
            tableComment: params.tableComment,
          })
          return {
            data: items,
            total: items.length,
          }
        }}
      />
    </Modal>
  )
}

export default ImportModal
