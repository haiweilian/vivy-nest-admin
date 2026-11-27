import { useRequest } from '@umijs/max'
import { Alert, Button, Descriptions, Modal, Radio, Space, Typography } from 'antd'
import { useState } from 'react'
import { testModel } from '@/apis/ai/model'
import type { AiModel, ModelTestMode } from '@/apis/ai/model'

interface ConnectionTestProps {
  record: AiModel
  onClose: () => void
}

const ConnectionTest = ({ record, onClose }: ConnectionTestProps) => {
  const [mode, setMode] = useState<ModelTestMode>('chat')
  const { data, loading, run, mutate } = useRequest(testModel, { manual: true })

  return (
    <Modal
      open
      title={'模型连接测试：' + record.modelName}
      onCancel={onClose}
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      width={680}
      footer={[
        <Button key="close" disabled={loading} onClick={onClose}>
          关闭
        </Button>,
        <Button
          key="test"
          type="primary"
          loading={loading}
          onClick={() => {
            mutate(undefined)
            void run(record.id, mode).catch(() => {
              // Umi request 已统一反馈接口错误。
            })
          }}
        >
          {data ? '重新测试' : '开始测试'}
        </Button>,
      ]}
    >
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Typography.Text type="secondary">使用已保存的配置发送简短测试请求，停用模型也可以测试。</Typography.Text>
        <Radio.Group
          value={mode}
          disabled={loading}
          options={[
            { label: '流式回复', value: 'chat' },
            { label: '工具调用', value: 'tool' },
          ]}
          onChange={(event) => {
            setMode(event.target.value)
            mutate(undefined)
          }}
        />
        {data ? (
          <>
            <Alert
              showIcon
              type={data.success ? 'success' : 'error'}
              title={data.success ? '连接测试成功' : '连接测试失败'}
              description={data.errorMessage}
            />
            <Descriptions column={2} size="small">
              <Descriptions.Item label="耗时">{data.latencyMs} 毫秒</Descriptions.Item>
              <Descriptions.Item label="流式数据">{data.streaming ? '已收到' : '未收到'}</Descriptions.Item>
              <Descriptions.Item label="Token用量" span={2}>
                {data.usage
                  ? '输入 ' +
                    data.usage.inputTokens +
                    ' / 输出 ' +
                    data.usage.outputTokens +
                    ' / 总计 ' +
                    data.usage.totalTokens
                  : '服务未返回用量'}
              </Descriptions.Item>
            </Descriptions>
            {data.response ? (
              <Typography.Paragraph copyable style={{ whiteSpace: 'pre-wrap', maxHeight: 280, overflow: 'auto' }}>
                {data.response}
              </Typography.Paragraph>
            ) : null}
            {data.toolCalls.length ? (
              <pre style={{ maxHeight: 280, overflow: 'auto' }}>{JSON.stringify(data.toolCalls, null, 2)}</pre>
            ) : null}
          </>
        ) : null}
      </Space>
    </Modal>
  )
}

export default ConnectionTest
