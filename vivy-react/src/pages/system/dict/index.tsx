import { DeleteOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Link, useModel, Access, useAccess, useRequest } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listDictType, deleteDictType, refreshDictCache } from '@/apis/system/dict'
import type { DictTypeModel } from '@/apis/system/dict'
import { Message } from '@/components/App'
import { DictTag } from '@/components/Dict'
import UpdateForm from './components/UpdateForm'

const DictType = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<DictTypeModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 删除字典类型
   * @param dictIds 字典类型ID
   */
  const handleDelete = async (dictIds: number | string) => {
    await deleteDictType(dictIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 刷新字典缓存
   */
  const { run: runRefreshDictCache, loading: refreshDictCacheLoading } = useRequest(refreshDictCache, {
    manual: true,
    onSuccess() {
      Message.success('刷新成功')
    },
  })

  /**
   * 表格列配置
   */
  const columns: ProColumns<DictTypeModel>[] = [
    {
      title: '字典编号',
      dataIndex: 'dictId',
      search: false,
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      render: (_, record) => {
        return <Link to={`/system/dict/${record.dictType}`}>{record.dictType}</Link>
      },
    },
    {
      title: '显示顺序',
      dataIndex: 'dictSort',
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
        <Access key="update" accessible={hasPermission('system:dict:update')}>
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
        <Access key="delete" accessible={hasPermission('system:dict:delete')}>
          <Popconfirm title="是否确认删除？" onConfirm={() => handleDelete(record.dictId)}>
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
        rowKey="dictId"
        headerTitle="字典列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listDictType({
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
            <Access key="add" accessible={hasPermission('system:dict:add')}>
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
            <Access key="delete" accessible={hasPermission('system:dict:delete')}>
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
            <Access key="cache" accessible={hasPermission('system:config:delete')}>
              <Button
                icon={<RedoOutlined spin={refreshDictCacheLoading} />}
                type="primary"
                danger
                onClick={runRefreshDictCache}
              >
                刷新缓存
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

export default DictType
