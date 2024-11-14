import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { Button, Modal, Space } from 'antd'
import { useRef, useState } from 'react'
import { addJob, updateJob, infoJob } from '@/apis/monitor/job'
import type { CreateJobParams, JobModel } from '@/apis/monitor/job'
import { cronValidate, CronTab } from '@/components/Cron'

interface UpdateFormProps extends DrawerFormProps {
  record?: JobModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysJobGroup = loadDict('sys_job_group')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoJob } = useRequest(infoJob, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoJob(record.jobId)
  }

  /**
   * Cron 表达式生成
   */
  const [cronOpen, setCronOpen] = useState(false)
  const [cronValue, setCronValue] = useState('')

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateJobParams) => {
    if (record) {
      await updateJob(record.jobId, values)
    } else {
      await addJob(values)
    }
  }

  return (
    <>
      <DrawerForm
        {...props}
        layout="horizontal"
        labelCol={{ flex: '100px' }}
        formRef={formRef}
        title={record ? `编辑定时任务` : `新增定时任务`}
        onFinish={async (values: any) => {
          await handleSubmit(values)
          props.onFinish?.(values)
          return true
        }}
        onOpenChange={(open) => {
          open && handleInitial()
          props.onOpenChange?.(open)
        }}
      >
        <ProFormText name="jobName" label="任务名称" rules={[{ required: true }]} fieldProps={{ maxLength: 100 }} />
        <ProFormSelect
          name="jobGroup"
          label="任务组名"
          rules={[{ required: true }]}
          fieldProps={{ options: toSelect(sysJobGroup) }}
        />
        <ProFormText
          name="invokeTarget"
          label="调用目标"
          rules={[{ required: true }]}
          fieldProps={{ maxLength: 500 }}
        />
        <ProFormText name="invokeParams" label="调用参数" fieldProps={{ maxLength: 500 }} />
        <Space.Compact style={{ width: '100%', display: 'flex' }}>
          <ProFormText
            name="cronExpression"
            label="Cron表达式"
            rules={[
              { required: true },
              {
                validator(_, value) {
                  if (cronValidate(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Cron表达式格式不正确'))
                },
              },
            ]}
            fieldProps={{ maxLength: 100 }}
            formItemProps={{ style: { flex: 1 } }}
          />
          <Button type="primary" onClick={() => setCronOpen(true)}>
            生成表达式
          </Button>
        </Space.Compact>
        <ProFormRadio.Group
          name="status"
          label="状态"
          fieldProps={{ options: toSelect(sysNormalDisable) }}
          initialValue={'0'}
        />
        <ProFormTextArea name="remark" label="备注" fieldProps={{ maxLength: 500, showCount: true }} />
        <Modal
          title="Cron表达式生成器"
          width={1000}
          open={cronOpen}
          onCancel={() => setCronOpen(false)}
          onOk={() => {
            setCronOpen(false)
            formRef.current?.setFieldsValue({
              cronExpression: cronValue,
            })
          }}
        >
          <CronTab onChange={setCronValue} />
        </Modal>
      </DrawerForm>
    </>
  )
}

export default UpdateForm
