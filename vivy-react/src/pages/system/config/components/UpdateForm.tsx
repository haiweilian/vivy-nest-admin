import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { useRef } from 'react'
import { addConfig, updateConfig, infoConfig } from '@/apis/system/config'
import type { CreateConfigParams, ConfigModel } from '@/apis/system/config'

interface UpdateFormProps extends DrawerFormProps {
  record?: ConfigModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoConfig } = useRequest(infoConfig, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoConfig(record.configId)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateConfigParams) => {
    if (record) {
      await updateConfig({
        ...values,
        configId: record.configId,
      })
    } else {
      await addConfig(values)
    }
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `编辑参数配置` : `新增参数配置`}
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
      <ProFormText name="configName" label="参数名称" rules={[{ required: true }]} fieldProps={{ maxLength: 100 }} />
      <ProFormText name="configKey" label="参数键名" rules={[{ required: true }]} fieldProps={{ maxLength: 100 }} />
      <ProFormText name="configValue" label="参数键值" rules={[{ required: true }]} fieldProps={{ maxLength: 500 }} />
      <ProFormRadio.Group
        name="status"
        label="状态"
        initialValue={'0'}
        rules={[{ required: true }]}
        fieldProps={{ options: toSelect(sysNormalDisable) }}
      />
      <ProFormTextArea name="remark" label="备注" fieldProps={{ maxLength: 500, showCount: true }} />
    </DrawerForm>
  )
}

export default UpdateForm
