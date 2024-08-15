import { type DrawerFormProps, type ProFormInstance, DrawerForm, ProFormUploadButton } from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { UploadFile } from 'antd'
import { useRef, useState } from 'react'
import { addFile, fileUseOptions, uploadFile } from '@/apis/file'
import UseSelect from './UseSelect'

const UploadForm: React.FC<DrawerFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 获取用途选项
   */
  const [useOptions, setUseOptions] = useState<string[]>([])
  useRequest(fileUseOptions, {
    onSuccess(data) {
      setUseOptions(data)
    },
  })

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: { fileUse: string; files: UploadFile[] }) => {
    const data = new FormData()
    const file = values.files[0]
    // data.append('path', 'base')
    // data.append('name', file.name)
    data.append('file', file.originFileObj!)
    const info = await uploadFile(data)
    await addFile({
      ...info,
      fileUse: values.fileUse,
    })
  }

  return (
    <DrawerForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={`新增文件`}
      onFinish={async (values: any) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
      onOpenChange={(open) => {
        formRef.current?.resetFields()
        props.onOpenChange?.(open)
      }}
    >
      <UseSelect options={useOptions} onChange={setUseOptions} />
      <ProFormUploadButton
        name="files"
        label="上传文件"
        max={1}
        required
        rules={[{ required: true, message: '请上传文件' }]}
        fieldProps={{ multiple: false, maxCount: 1 }}
      />
    </DrawerForm>
  )
}

export default UploadForm
