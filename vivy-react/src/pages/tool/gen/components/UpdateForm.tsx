import { type DrawerFormProps, type ProFormInstance, DrawerForm } from '@ant-design/pro-components'
import { Tabs } from 'antd'
import { useRef, useEffect, useState } from 'react'
import { infoGenTable, updateGenTable } from '@/apis/gen/gen'
import type { GenTableModel, GenTableColumnModel, UpdateGenParams } from '@/apis/gen/gen'
import UpdateFormBase from './UpdateFormBase'
import UpdateFormColumn from './UpdateFormColumn'

interface UpdateFormProps extends DrawerFormProps {
  record?: GenTableModel
}

const UpdateForm: React.FC<UpdateFormProps> = ({ record, ...props }) => {
  const formRef = useRef<ProFormInstance>()
  const [tableInfo, setTableInfo] = useState<GenTableModel>()

  /**
   * 获取初始化数据
   */
  useEffect(() => {
    formRef.current?.resetFields()
    if (record) {
      infoGenTable(record.tableId).then((info) => {
        setTableInfo(info)
        formRef.current?.setFieldsValue(info)
      })
    }
  }, [record])

  /**
   * 提交表单
   * @param values 表单值
   */
  const handleSubmit = async (values: UpdateGenParams) => {
    if (tableInfo) {
      await updateGenTable({
        ...values,
        columns: tableInfo.columns,
        tableId: tableInfo.tableId,
      })
    }
    formRef.current?.resetFields()
  }

  return (
    <DrawerForm
      {...props}
      width={'95vw'}
      layout="horizontal"
      labelCol={{ flex: '120px' }}
      drawerProps={{ bodyStyle: { paddingTop: 0 } }}
      formRef={formRef}
      title={record ? `编辑表` : `新增表`}
      onFinish={async (values: any) => {
        await handleSubmit(values)
        props.onFinish?.(values)
        return true
      }}
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: `基础信息`,
            children: <UpdateFormBase />,
          },
          {
            key: '2',
            label: '字段信息',
            children: (
              <UpdateFormColumn
                value={tableInfo?.columns || []}
                onChange={(newColumns: GenTableColumnModel[]) => {
                  setTableInfo({
                    ...tableInfo!,
                    columns: newColumns,
                  })
                }}
              />
            ),
          },
        ]}
      />
    </DrawerForm>
  )
}

export default UpdateForm
