import { type DrawerFormProps, type ProFormInstance, DrawerForm, ProFormUploadButton } from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { UploadFile } from 'antd'
import { useRef, useState } from 'react'
import { addFile, fileUseOptions, uploadFiles } from '@/apis/file'
import UseSelect from './UseSelect'

const UploadsForm: React.FC<DrawerFormProps> = (props) => {
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
    data.append('path', 'base')
    for (const file of values.files) {
      data.append('files', file.originFileObj!)
    }
    const urls = await uploadFiles(data)
    await addFile(
      values.files.map((file, index) => {
        const originFile = file.originFileObj!
        return {
          fileUrl: urls[index],
          fileUse: values.fileUse,
          fileSize: originFile.size,
          fileType: originFile.type,
          fileName: originFile.name,
        }
      })
    )
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
        fieldProps={{ multiple: true, maxCount: 99 }}
      />
    </DrawerForm>
  )
}

export default UploadsForm
