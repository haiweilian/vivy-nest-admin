import { PlusOutlined } from '@ant-design/icons'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { Access, useAccess, useModel } from '@umijs/max'
import { Button, message, Popconfirm, Tag } from 'antd'
import { useRef, useState } from 'react'
import { deleteModel, listModel, updateModelStatus } from '@/apis/ai/model'
import type { AiModel } from '@/apis/ai/model'
import { DictTag } from '@/components/Dict'
import ConnectionTest from './components/ConnectionTest'
import { MODEL_PROVIDER_OPTIONS } from './components/constants'
import UpdateForm from './components/UpdateForm'

const Model = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>(null)
  const [record, setRecord] = useState<AiModel>()
  const [formOpen, setFormOpen] = useState(false)
  const [testRecord, setTestRecord] = useState<AiModel>()
  const { loadDict, toSelect } = useModel('dict')
  const normalDisable = loadDict('sys_normal_disable')

  const columns: ProColumns<AiModel>[] = [
    {
      title: '搜索',
      dataIndex: 'search',
      hideInTable: true,
      fieldProps: { placeholder: '搜索名称、来源或模型标识' },
    },
    { title: '模型名称', dataIndex: 'modelName', search: false },
    {
      title: '适配器',
      dataIndex: 'provider',
      valueType: 'select',
      fieldProps: { options: MODEL_PROVIDER_OPTIONS },
      render: (_, item) => MODEL_PROVIDER_OPTIONS.find((option) => option.value === item.provider)?.label,
    },
    { title: '模型来源', dataIndex: 'vendor', search: false },
    { title: '模型标识', dataIndex: 'modelCode', search: false, ellipsis: true },
    { title: '接口地址', dataIndex: 'baseUrl', search: false, ellipsis: true },
    {
      title: '密钥',
      dataIndex: 'hasCredential',
      search: false,
      width: 90,
      render: (_, item) => (
        <Tag color={item.hasCredential ? 'green' : 'default'}>{item.hasCredential ? '已配置' : '未配置'}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { options: toSelect(normalDisable) },
      render: (_, item) => <DictTag options={normalDisable} value={item.status} />,
    },
    { title: '更新时间', dataIndex: 'updateTime', search: false, width: 170 },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 290,
      render: (_, item) => [
        <Access key="edit" accessible={hasPermission('ai:model:update') && hasPermission('ai:model:query')}>
          <Button
            type="link"
            onClick={() => {
              setRecord(item)
              setFormOpen(true)
            }}
          >
            编辑
          </Button>
        </Access>,
        <Access key="test" accessible={hasPermission('ai:model:test')}>
          <Button type="link" onClick={() => setTestRecord(item)}>
            测试
          </Button>
        </Access>,
        <Access key="status" accessible={hasPermission('ai:model:update')}>
          <Popconfirm
            title={item.status === '0' ? '确认停用此模型？' : '确认启用此模型？'}
            onConfirm={async () => {
              await updateModelStatus(item.id, item.status === '0' ? '1' : '0')
              message.success('模型状态已更新')
              actionRef.current?.reload()
            }}
          >
            <Button type="link">{item.status === '0' ? '停用' : '启用'}</Button>
          </Popconfirm>
        </Access>,
        <Access key="delete" accessible={hasPermission('ai:model:delete')}>
          <Popconfirm
            title="确认删除此模型配置？"
            onConfirm={async () => {
              await deleteModel(item.id)
              message.success('模型配置已删除')
              actionRef.current?.reload()
            }}
          >
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
      <ProTable<AiModel>
        rowKey="id"
        headerTitle="模型管理"
        bordered
        actionRef={actionRef}
        columns={columns}
        scroll={{ x: 1280 }}
        request={async (params) => {
          const { items, meta } = await listModel({
            search: params.search || undefined,
            provider: params.provider,
            status: params.status,
            page: params.current,
            limit: params.pageSize,
          })
          return { data: items, total: meta.totalItems }
        }}
        toolbar={{
          actions: [
            <Access key="add" accessible={hasPermission('ai:model:add')}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setRecord(undefined)
                  setFormOpen(true)
                }}
              >
                新增模型
              </Button>
            </Access>,
          ],
        }}
      />

      <UpdateForm
        record={record}
        open={formOpen}
        onOpenChange={setFormOpen}
        onFinish={async () => {
          message.success(record ? '模型配置已更新' : '模型配置已创建')
          actionRef.current?.reload()
        }}
      />

      {testRecord ? (
        <ConnectionTest key={testRecord.id} record={testRecord} onClose={() => setTestRecord(undefined)} />
      ) : null}
    </>
  )
}

export default Model
