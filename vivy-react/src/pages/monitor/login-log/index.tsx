import { DeleteOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef } from 'react'
import { listLoginLog, clearLoginLog } from '@/apis/monitor/login-log'
import type { LoginLogModel } from '@/apis/monitor/login-log'
import { DictTag } from '@/components/Dict'

const LoginLog = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>(null)

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysSuccessFailure = loadDict('sys_success_failure')

  /**
   * 清空登录日志
   */
  const handleClearLog = async () => {
    await clearLoginLog()
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<LoginLogModel>[] = [
    {
      title: '日志编号',
      dataIndex: 'loginId',
      search: false,
    },
    {
      title: '用户名称',
      dataIndex: 'loginName',
    },
    {
      title: '登录地址',
      dataIndex: 'loginIp',
      search: false,
    },
    {
      title: '登录地点',
      dataIndex: 'loginLocation',
      search: false,
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      search: false,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      search: false,
    },
    {
      title: '登录状态',
      dataIndex: 'loginStatus',
      valueType: 'select',
      fieldProps: { options: toSelect(sysSuccessFailure) },
      render: (_, record) => {
        return <DictTag options={sysSuccessFailure} value={record.loginStatus} />
      },
    },
    {
      title: '登录日期',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: (_, record) => {
        return record.createTime
      },
    },
  ]

  return (
    <ProTable
      rowKey="loginId"
      headerTitle="登录日志"
      bordered
      columns={columns}
      actionRef={actionRef}
      request={async (params) => {
        const { items, meta } = await listLoginLog({
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
          <Access key="clean" accessible={hasPermission('monitor:loginLog:delete')}>
            <Popconfirm title="是否确认清空？" onConfirm={handleClearLog}>
              <Button icon={<DeleteOutlined />} type="primary" danger>
                清空
              </Button>
            </Popconfirm>
          </Access>,
        ],
      }}
    />
  )
}

export default LoginLog
