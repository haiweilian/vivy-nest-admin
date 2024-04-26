import { DeleteOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, useSearchParams } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef } from 'react'
import { listJobLog, clearJobLog } from '@/apis/monitor/job'
import type { JobLogModel } from '@/apis/monitor/job'
import { DictTag, DictText } from '@/components/Dict'

const JobLog = () => {
  const [searchParams] = useSearchParams()
  const actionRef = useRef<ActionType>()

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysJobGroup = loadDict('sys_job_group')
  const sysSuccessFailure = loadDict('sys_success_failure')

  /**
   * 表格列配置
   */
  const columns: ProColumns<JobLogModel>[] = [
    {
      title: '日志编号',
      dataIndex: 'jobLogId',
      search: false,
    },
    {
      title: '任务ID',
      dataIndex: 'jobId',
      hideInTable: true,
      initialValue: searchParams.get('jobId'),
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
      search: false,
    },
    {
      title: '调用参数',
      dataIndex: 'invokeParams',
      search: false,
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { options: toSelect(sysSuccessFailure) },
      render: (_, record) => {
        return <DictTag options={sysSuccessFailure} value={record.status} />
      },
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      search: false,
    },
  ]

  return (
    <>
      <ProTable
        rowKey="jobLogId"
        headerTitle="任务日志列表"
        bordered
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const { items, meta } = await listJobLog({
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
            <Popconfirm key="clear" title="是否确认清空？" onConfirm={() => clearJobLog()}>
              <Button icon={<DeleteOutlined />} type="primary" danger>
                清空
              </Button>
            </Popconfirm>,
          ],
        }}
      />
    </>
  )
}

export default JobLog
