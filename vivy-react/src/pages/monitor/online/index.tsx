import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useAccess } from '@umijs/max'
import { Button, Popconfirm } from 'antd'
import { useRef } from 'react'
import { listOnline, logoutOnline } from '@/apis/monitor/online'
import type { OnlineInfoResult } from '@/apis/monitor/online'

const Online = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()

  /**
   * 强退用户
   */
  const handleLogout = async (key: string) => {
    await logoutOnline(key)
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<OnlineInfoResult>[] = [
    {
      title: '会话编号',
      dataIndex: 'userSk',
      search: false,
      width: 400,
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      search: false,
    },
    {
      title: '登录地址',
      dataIndex: 'loginIp',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      hideInTable: !hasPermission('monitor:online:logout'),
      render: (_, record) => [
        <Popconfirm title="是否确认强退？" onConfirm={() => handleLogout(record.userSk)}>
          <Button type="link" danger>
            强退
          </Button>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ProTable
      rowKey="userSk"
      headerTitle="在线用户"
      bordered
      columns={columns}
      actionRef={actionRef}
      request={async (params: any) => {
        const data = await listOnline(params)
        return {
          data,
          total: data.length,
        }
      }}
    />
  )
}

export default Online
