import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { useCallback, useEffect, useRef } from 'react'
import { addModel, infoModel, updateModel } from '@/apis/ai/model'
import type { AiModel, CreateModelParams } from '@/apis/ai/model'
import { MODEL_PROVIDER_OPTIONS } from './constants'

interface UpdateFormProps extends DrawerFormProps<CreateModelParams> {
  record?: AiModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, open, ...props }) => {
  const formRef = useRef<ProFormInstance<CreateModelParams>>(undefined)

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const {
    run: runInfoModel,
    loading,
    error,
  } = useRequest(infoModel, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })

  const handleInitial = useCallback(() => {
    formRef.current?.resetFields()
    record && runInfoModel(record.id)
  }, [record, runInfoModel])

  useEffect(() => {
    if (open) handleInitial()
  }, [open, handleInitial])

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async ({ secretKey, ...values }: CreateModelParams) => {
    const key = secretKey?.trim()
    if (record) {
      await updateModel(record.id, key ? { ...values, secretKey: key } : values)
      return
    }
    await addModel({ ...values, secretKey: key! })
  }

  return (
    <DrawerForm<CreateModelParams>
      {...props}
      open={open}
      formRef={formRef}
      title={record ? `编辑模型` : `新增模型`}
      size={640}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
      submitter={{ submitButtonProps: { disabled: loading || Boolean(record && error) } }}
      onFinish={async (values) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
    >
      <ProFormSelect
        name="provider"
        label="模型适配器"
        options={MODEL_PROVIDER_OPTIONS}
        initialValue="openai"
        rules={[{ required: true }]}
        tooltip="适配器决定调用协议；OpenAI兼容可接入支持该协议的模型服务。"
      />
      <ProFormText name="vendor" label="模型来源" rules={[{ required: true, whitespace: true, max: 100 }]} />
      <ProFormText name="modelName" label="模型名称" rules={[{ required: true, whitespace: true, max: 100 }]} />
      <ProFormText
        name="modelCode"
        label="模型标识"
        rules={[{ required: true, whitespace: true, max: 100 }]}
        tooltip="填写服务商提供的模型调用标识。"
      />
      <ProFormText
        name="baseUrl"
        label="接口地址"
        placeholder="https://api.openai.com/v1"
        rules={[
          { required: true, max: 2048 },
          {
            validator: async (_rule, value: string) => {
              if (!value) return
              try {
                const url = new URL(value.trim())
                if (
                  ['http:', 'https:'].includes(url.protocol) &&
                  !url.username &&
                  !url.password &&
                  !url.search &&
                  !url.hash
                ) {
                  return
                }
              } catch {
                // 交由下方统一提示格式错误。
              }
              throw new Error('请输入不含凭据、查询参数和片段的HTTP接口地址')
            },
          },
        ]}
      />
      <ProFormText.Password
        name="secretKey"
        label="接口密钥"
        placeholder={record ? '留空保留原密钥' : '请输入模型服务密钥'}
        fieldProps={{ autoComplete: 'new-password' }}
        rules={[
          { required: !record, whitespace: true, max: 256 },
          { pattern: /^\S+$/, message: '密钥不能包含空白字符' },
        ]}
        extra={record ? '已保存的密钥不会回显；填写新密钥后替换。' : undefined}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        initialValue={'1'}
        fieldProps={{ options: toSelect(sysNormalDisable) }}
        rules={[{ required: true }]}
      />
    </DrawerForm>
  )
}

export default UpdateForm
