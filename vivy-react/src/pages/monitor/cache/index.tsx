import { DeleteOutlined, RedoOutlined } from '@ant-design/icons'
import { Access, useAccess, useRequest } from '@umijs/max'
import { Button, Card, Col, Form, Input, Popconfirm, Row, Table } from 'antd'
import { useState } from 'react'
import {
  getCaches,
  getCacheKeys,
  getCacheValue,
  deleteCacheByName,
  deleteCacheByNameAndKey,
} from '@/apis/monitor/cache'

const Cache = () => {
  const { hasPermission } = useAccess()

  const [cacheName, setCacheName] = useState<string>()
  const [cacheKey, setCacheKey] = useState<string>()
  const {
    run: runGetCaches,
    loading: cachesLoading,
    data: cachesDataSource,
  } = useRequest(getCaches, {
    manual: false,
  })
  const {
    run: runGetCacheKeys,
    loading: cacheKeysLoading,
    data: cacheKeysDataSource,
  } = useRequest(getCacheKeys, {
    manual: true,
  })
  const {
    run: runGetCacheValue,
    loading: cacheValueLoading,
    data: cacheValueDataSource,
    mutate: setCacheValueDataSource,
  } = useRequest(getCacheValue, {
    manual: true,
  })
  const { run: runDeleteCacheByName } = useRequest(deleteCacheByName, {
    manual: true,
    onSuccess() {
      runGetCacheKeys(cacheName!)
    },
  })
  const { run: runDeleteCacheByNameAndKey } = useRequest(deleteCacheByNameAndKey, {
    manual: true,
    onSuccess() {
      runGetCacheKeys(cacheName!)
    },
  })

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card
          title="缓存列表"
          size="small"
          extra={
            <Button type="link" onClick={runGetCaches}>
              <RedoOutlined spin={cachesLoading} />
            </Button>
          }
        >
          <Table
            rowKey="name"
            size="small"
            bordered
            pagination={false}
            rowSelection={{
              type: 'radio',
              columnTitle: '序号',
              columnWidth: 80,
              renderCell: (_, __, index) => index + 1,
              selectedRowKeys: cacheName ? [cacheName] : [],
            }}
            columns={[
              {
                title: '缓存名称',
                dataIndex: 'name',
              },
              {
                title: '备注',
                dataIndex: 'remark',
              },
              {
                title: '操作',
                dataIndex: 'option',
                align: 'center',
                width: 80,
                render: (_, record) => [
                  <Access key="delete" accessible={hasPermission('monitor:cache:delete')}>
                    <Popconfirm title="是否确认清除缓存？" onConfirm={() => runDeleteCacheByName(record.name)}>
                      <Button type="link">
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </Access>,
                ],
              },
            ]}
            dataSource={cachesDataSource}
            onRow={(record) => ({
              onClick: () => {
                setCacheName(record.name)
                setCacheKey(undefined)
                runGetCacheKeys(record.name)
                setCacheValueDataSource(undefined)
              },
            })}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="键名列表"
          size="small"
          extra={
            <Button type="link" disabled={!cacheName} onClick={() => runGetCacheKeys(cacheName!)}>
              <RedoOutlined spin={cacheKeysLoading} />
            </Button>
          }
        >
          <Table
            rowKey="key"
            size="small"
            bordered
            pagination={false}
            rowSelection={{
              type: 'radio',
              columnTitle: '序号',
              columnWidth: 80,
              renderCell: (_, __, index) => index + 1,
              selectedRowKeys: cacheKey ? [cacheKey] : [],
            }}
            columns={[
              {
                title: '缓存键名',
                dataIndex: 'key',
                ellipsis: true,
              },
              {
                title: '操作',
                dataIndex: 'option',
                align: 'center',
                width: 80,
                render: (_, record) => [
                  <Access key="delete" accessible={hasPermission('monitor:cache:delete')}>
                    <Popconfirm
                      title="是否确认清除缓存？"
                      onConfirm={() => runDeleteCacheByNameAndKey(record.name, record.key)}
                    >
                      <Button type="link">
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </Access>,
                ],
              },
            ]}
            dataSource={cacheKeysDataSource}
            onRow={(record) => ({
              onClick: () => {
                setCacheKey(record.key)
                runGetCacheValue(record.name, record.key)
              },
            })}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title="缓存内容"
          size="small"
          extra={
            <Button type="link" disabled={!cacheKey} onClick={() => runGetCacheValue(cacheName!, cacheKey!)}>
              <RedoOutlined spin={cacheValueLoading} />
            </Button>
          }
        >
          <Form layout="vertical">
            <Form.Item label="缓存名称">
              <Input readOnly value={cacheValueDataSource?.name} />
            </Form.Item>
            <Form.Item label="缓存键名">
              <Input readOnly value={cacheValueDataSource?.key} />
            </Form.Item>
            <Form.Item label="缓存内容">
              <Input.TextArea rows={5} readOnly value={cacheValueDataSource?.value} />
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default Cache
