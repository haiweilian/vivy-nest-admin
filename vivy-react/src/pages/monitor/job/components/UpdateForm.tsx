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
import { useRef } from 'react'
import { addJob, updateJob, infoJob } from '@/apis/monitor/job'
import type { CreateJobParams, JobModel } from '@/apis/monitor/job'

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
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateJobParams) => {
    if (record) {
      await updateJob({
        ...values,
        jobId: record.jobId,
      })
    } else {
      await addJob(values)
    }
  }

  return (
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
      <ProFormText name="invokeTarget" label="调用目标" rules={[{ required: true }]} fieldProps={{ maxLength: 500 }} />
      <ProFormText name="invokeParams" label="调用参数" fieldProps={{ maxLength: 500 }} />
      <ProFormText
        name="cronExpression"
        label="Cron表达式"
        rules={[{ required: true }]}
        fieldProps={{ maxLength: 100 }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        fieldProps={{ options: toSelect(sysNormalDisable) }}
        initialValue={'0'}
      />
      <ProFormTextArea name="remark" label="备注" fieldProps={{ maxLength: 500, showCount: true }} />
    </DrawerForm>
  )
}

export default UpdateForm
