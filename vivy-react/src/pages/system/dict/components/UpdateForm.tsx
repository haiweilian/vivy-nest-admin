import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormDigit,
  ProFormRadio,
} from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { useRef } from 'react'
import { addDictType, updateDictType, infoDictType } from '@/apis/system/dict'
import type { CreateDictTypeParams, DictTypeModel } from '@/apis/system/dict'

interface UpdateFormProps extends DrawerFormProps {
  record?: DictTypeModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>(null)

  /**
   * 注册字典数据
   */
  const { loadDict, toSelect } = useModel('dict')
  const sysNormalDisable = loadDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  const { run: runInfoDictType } = useRequest(infoDictType, {
    manual: true,
    onSuccess(data) {
      formRef.current?.setFieldsValue(data)
    },
  })
  const handleInitial = () => {
    formRef.current?.resetFields()
    record && runInfoDictType(record.dictId)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: CreateDictTypeParams) => {
    if (record) {
      await updateDictType(record.dictId, values)
    } else {
      await addDictType(values)
    }
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `编辑字典` : `新增字典`}
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
      <ProFormText name="dictName" label="字典名称" rules={[{ required: true, max: 100 }]} />
      <ProFormText name="dictType" label="字典类型" rules={[{ required: true, max: 100 }]} />
      <ProFormDigit name="dictSort" label="显示顺序" fieldProps={{ min: 0, precision: 0 }} />
      <ProFormRadio.Group
        name="status"
        label="状态"
        initialValue={'0'}
        fieldProps={{ options: toSelect(sysNormalDisable) }}
      />
    </DrawerForm>
  )
}

export default UpdateForm
