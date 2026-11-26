import { type DrawerFormProps, type ProFormInstance, DrawerForm, ProFormUploadButton } from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { UploadFile } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { addFile, fileUseOptions, uploadFile } from '@/apis/file'
import UseSelect from './UseSelect'

const UploadForm: React.FC<DrawerFormProps> = ({ open, ...props }) => {
  const formRef = useRef<ProFormInstance>(undefined)

  useEffect(() => {
    if (open) formRef.current?.resetFields()
  }, [open])

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
    data.append('path', 'base')
    data.append('file', file.originFileObj!)
    const url = await uploadFile(data)
    const originFile = file.originFileObj!
    await addFile({
      fileUrl: url,
      fileUse: values.fileUse,
      fileSize: originFile.size,
      fileType: originFile.type,
      fileName: originFile.name,
    })
  }

  return (
    <DrawerForm
      {...props}
      open={open}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title={`新增文件`}
      onFinish={async (values: any) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
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
