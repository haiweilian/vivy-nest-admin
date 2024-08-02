import { PlusOutlined } from '@ant-design/icons'
import {
  type DrawerFormProps,
  type ProFormInstance,
  DrawerForm,
  ProFormSelect,
  ProFormUploadButton,
} from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { Button, Divider, Input, InputRef, Space, UploadFile } from 'antd'
import { useRef, useState } from 'react'
import { addFile, fileUseOptions, uploadsFile } from '@/apis/file'

const UploadsForm: React.FC<DrawerFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>()

  /**
   * 获取用途选项
   */
  const [useName, setUseName] = useState('')
  const [useOptions, setUseOptions] = useState<string[]>([])
  const useInputRef = useRef<InputRef>(null)
  useRequest(fileUseOptions, {
    onSuccess(data) {
      setUseOptions(data)
    },
  })
  const onUseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseName(event.target.value)
  }
  const addUseOption = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    setUseOptions([...useOptions, useName])
    setUseName('')
    setTimeout(() => {
      useInputRef.current?.focus()
    }, 0)
  }

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: { fileUse: string; files: UploadFile[] }) => {
    const data = new FormData()
    for (const file of values.files) {
      data.append('path', 'base')
      // data.append('name', file.name)
      data.append('files', file.originFileObj!)
    }
    const infos = await uploadsFile(data)
    for (const info of infos) {
      await addFile({
        ...info,
        fileUse: values.fileUse,
      })
    }
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
      <ProFormSelect
        name="fileUse"
        label="文件用途"
        required
        rules={[{ required: true }]}
        fieldProps={{
          options: useOptions.map((item) => ({ label: item, value: item })),
          showSearch: true,
          dropdownRender(menu) {
            return (
              <>
                <Space style={{ padding: '0px 2px' }}>
                  <Input
                    placeholder="新增文件用途"
                    ref={useInputRef}
                    value={useName}
                    onChange={onUseNameChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    disabled={!useName || useOptions.includes(useName)}
                    onClick={addUseOption}
                  >
                    添加
                  </Button>
                </Space>
                <Divider style={{ margin: '4px' }} />
                {menu}
              </>
            )
          },
        }}
      />
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
