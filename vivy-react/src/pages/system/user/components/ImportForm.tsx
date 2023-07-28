import { DownloadOutlined } from '@ant-design/icons'
import {
  type ModalFormProps,
  type ProFormInstance,
  ModalForm,
  ProFormCheckbox,
  ProFormUploadDragger,
} from '@ant-design/pro-components'
import { useRef } from 'react'

const ImportForm: React.FC<ModalFormProps> = (props) => {
  const formRef = useRef<ProFormInstance>()

  return (
    <ModalForm
      {...props}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      formRef={formRef}
      title="用户导入"
      onFinish={async (formData) => {
        props.onFinish?.(formData)
        console.log(formData)
        return true
      }}
    >
      <ProFormUploadDragger
        name="upload"
        description="仅允许导入xls、xlsx格式文件"
        fieldProps={{ multiple: false, maxCount: 1, accept: '.xlsx, .xls' }}
      />
      <ProFormCheckbox name="update">
        是否更新已经存在的用户数据
        <a className="pl-10">
          <DownloadOutlined />
          下载模板
        </a>
      </ProFormCheckbox>
    </ModalForm>
  )
}

export default ImportForm
