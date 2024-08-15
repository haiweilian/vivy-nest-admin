import { DeleteOutlined, PlusOutlined, HistoryOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Link, useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { listJob, deleteJob, onceJob } from '@/apis/monitor/job'
import type { JobModel } from '@/apis/monitor/job'
import { DictTag, DictText } from '@/components/Dict'
import UpdateForm from './components/UpdateForm'

const Job = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<JobModel>()
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysJobGroup = loadDict('sys_job_group')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 删除定时任务
   * @param jobIds 定时任务ID
   */
  const handleDelete = async (jobIds: number | string) => {
    await deleteJob(jobIds)
    setSelectedRowKeys([])
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<JobModel>[] = [
    {
      title: '任务编号',
      dataIndex: 'jobId',
      search: false,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '任务组名',
      dataIndex: 'jobGroup',
      valueType: 'select',
      fieldProps: { options: toSelect(sysJobGroup) },
      render: (_, record) => {
        return <DictText options={sysJobGroup} value={record.jobGroup} />
      },
    },
    {
      title: '调用目标',
      dataIndex: 'invokeTarget',
    },
    {
      title: 'Cron表达式',
      dataIndex: 'cronExpression',
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
      width: 250,
      render: (_, record) => [
        <Access key="update" accessible={hasPermission('monitor:job:update')}>
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
        <Access key="delete" accessible={hasPermission('monitor:job:delete')}>
          <Popconfirm title="是否确认删除？" onConfirm={() => handleDelete(record.jobId)}>
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Access>,
        <Access key="once" accessible={hasPermission('monitor:job:update')}>
          <Popconfirm title="是否确认执行？" onConfirm={() => onceJob(record.jobId)}>
            <Button type="link">执行一次</Button>
          </Popconfirm>
        </Access>,
        <Link key="log" to={`/monitor/job/log?jobId=${record.jobId}`}>
          调度日志
        </Link>,
      ],
    },
  ]

  return (
    <>
      <ProTable
        rowKey="jobId"
        headerTitle="定时任务列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        request={async (params) => {
          const { items, meta } = await listJob({
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
            <Access key="add" accessible={hasPermission('monitor:job:add')}>
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
            <Access key="delete" accessible={hasPermission('monitor:job:delete')}>
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
            <Link key="log" to={`/monitor/job/log`}>
              <Button icon={<HistoryOutlined />}>调度日志</Button>
            </Link>,
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

export default Job
