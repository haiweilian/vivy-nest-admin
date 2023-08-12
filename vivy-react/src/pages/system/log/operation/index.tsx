import { DeleteOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { useModel, Access, useAccess } from '@umijs/max'
import { Button, Popconfirm, Drawer, Descriptions } from 'antd'
import { useRef, useState } from 'react'
import { listOperLog, clearOperLog } from '@/apis/system/oper-log'
import type { OperLogResult } from '@/apis/system/oper-log'
import { DictTag, DictText } from '@/components/Dict'

const OperationLog = () => {
  const { hasPermission } = useAccess()
  const actionRef = useRef<ActionType>()
  const [record, setRecord] = useState<OperLogResult>()
  const [openDrawer, setOpenDrawer] = useState(false)

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysOperType = loadDict('sys_oper_type')
  const sysOperStatus = loadDict('sys_oper_status')

  /**
   * 清空操作日志
   */
  const handleClearLog = async () => {
    await clearOperLog()
    actionRef.current?.reload()
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<OperLogResult>[] = [
    {
      title: '日志编号',
      dataIndex: 'operId',
      search: false,
    },
    {
      title: '系统模块',
      dataIndex: 'title',
    },
    {
      title: '操作类型',
      dataIndex: 'operType',
      valueType: 'select',
      fieldProps: { options: toSelect(sysOperType) },
      render: (_, record) => {
        return <DictTag options={sysOperType} value={record.operType} />
      },
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      search: false,
    },
    {
      title: '请求地址',
      dataIndex: 'requestUrl',
      hideInTable: true,
    },
    {
      title: '操作状态',
      dataIndex: 'operStatus',
      valueType: 'select',
      fieldProps: { options: toSelect(sysOperStatus) },
      render: (_, record) => {
        return <DictTag options={sysOperStatus} value={record.operStatus} />
      },
    },
    {
      title: '操作日期',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      render: (_, record) => {
        return record.createTime
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => [
        <Button
          key="detail"
          type="link"
          onClick={() => {
            setRecord(record)
            setOpenDrawer(true)
          }}
        >
          详情
        </Button>,
      ],
    },
  ]

  return (
    <>
      <ProTable
        rowKey="operId"
        headerTitle="操作日志"
        bordered
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const { items, meta } = await listOperLog({
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
            <Access key="clean" accessible={hasPermission('system:loginlog:delete')}>
              <Popconfirm title="是否确认清空？" onConfirm={handleClearLog}>
                <Button icon={<DeleteOutlined />} type="primary" danger>
                  清空
                </Button>
              </Popconfirm>
            </Access>,
          ],
        }}
      />
      <Drawer title="操作日志详情" width={1000} open={openDrawer} onClose={() => setOpenDrawer(false)}>
        {record ? (
          <Descriptions column={2}>
            <Descriptions.Item label="操作模块">
              {record.title} / <DictText options={sysOperType} value={record.operType} />
            </Descriptions.Item>
            <Descriptions.Item label="登录信息">
              {record.operName} / {record.operIp} / {record.operLocation}
            </Descriptions.Item>
            <Descriptions.Item label="请求方式">{record.requestMethod}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{record.requestUrl}</Descriptions.Item>
            <Descriptions.Item label="操作方法" span={2}>
              {record.operMethod}
            </Descriptions.Item>
            <Descriptions.Item label="请求参数" span={2}>
              {record.requestParam}
            </Descriptions.Item>
            <Descriptions.Item label="返回参数" span={2}>
              {record.requestResult}
            </Descriptions.Item>
            <Descriptions.Item label="错误消息" span={2}>
              {record.requestErrmsg}
            </Descriptions.Item>
            <Descriptions.Item label="操作状态" span={2}>
              <DictText options={sysOperStatus} value={record.operStatus} />
            </Descriptions.Item>
            <Descriptions.Item label="操作时间">{record.createTime}</Descriptions.Item>
          </Descriptions>
        ) : null}
      </Drawer>
    </>
  )
}

export default OperationLog
