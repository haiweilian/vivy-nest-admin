import { ProFormSelect, ProFormText } from '@ant-design/pro-components'
import type { DefaultOptionType } from 'antd/es/select'

const templateOptions: DefaultOptionType[] = [
  {
    value: '1',
    label: '单表（增删改查）',
  },
  {
    value: '2',
    label: '树表（增删改查）',
  },
]

const UpdateFormBase: React.FC = () => {
  return (
    <>
      <ProFormText name="tableName" label="表名称" rules={[{ required: true, max: 100 }]} />
      <ProFormText name="tableComment" label="表描述" rules={[{ required: true, max: 100 }]} />
      <ProFormText name="className" label="实体类名称" rules={[{ required: true, max: 100 }]} />
      <ProFormSelect name="templateCategory" label="生成模板" rules={[{ required: true }]} options={templateOptions} />
      <ProFormText
        name="businessName"
        label="生成业务名"
        tooltip="用作代码中的基础命名标识(可以理解为业务英文名)，例如 `user`、`userPhoto`"
        rules={[{ required: true, max: 100 }]}
      />
      <ProFormText
        name="functionName"
        label="生成功能名"
        tooltip="用作代码中的基础注释标识(可以理解为业务中文名)，例如 `用户`、`用户照片`"
        rules={[{ required: true, max: 100 }]}
      />
      <ProFormText name="functionAuthor" label="生成作者名" rules={[{ required: true, max: 100 }]} />
    </>
  )
}

export default UpdateFormBase
