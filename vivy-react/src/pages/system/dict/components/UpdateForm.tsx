import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormText,
  ProFormDigit,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { useRef, useEffect } from 'react'
import { addDictType, updateDictType, infoDictType } from '@/apis/system/dict-type'
import type { SysDictType } from '@/apis/types/system/dict-type'

interface UpdateFormProps extends DrawerFormProps {
  record: Nullable<SysDictType>
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 注册字典数据
   */
  const { selectDict } = useModel('dict')
  const sysNormalDisable = selectDict('sys_normal_disable')

  /**
   * 获取初始化数据
   */
  useEffect(() => {
    formRef.current?.resetFields()
    if (record) {
      infoDictType(record.dictId).then((info) => {
        formRef.current?.setFieldsValue(info)
      })
    }
  }, [record])

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: Recordable) => {
    if (record) {
      await updateDictType({
        ...values,
        dictId: record.dictId,
      })
    } else {
      await addDictType(values)
    }
    formRef.current?.resetFields()
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={record ? `编辑字典-${record.dictName}` : `新增字典`}
      onFinish={async (values) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
    >
      <ProFormText name="dictName" label="字典名称" rules={[{ required: true }]} />
      <ProFormText name="dictType" label="字典类型" rules={[{ required: true }]} />
      <ProFormDigit name="dictSort" label="显示顺序" fieldProps={{ min: 0, precision: 0 }} />
      <ProFormRadio.Group name="status" label="状态" initialValue={'0'} fieldProps={{ options: sysNormalDisable }} />
      <ProFormTextArea name="remark" label="备注" />
    </DrawerForm>
  )
}

export default UpdateForm
