import { EditableProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { DefaultOptionType } from 'antd/es/select'
import React from 'react'
import type { GenTableColumnModel } from '@/apis/gen/gen'
import { dictTypeOptions } from '@/apis/system/dict'

const tslangTypeOptions: DefaultOptionType[] = [
  { label: 'number', value: 'number' },
  { label: 'string', value: 'string' },
  { label: 'boolean', value: 'boolean' },
  { label: 'unknown', value: 'unknown' },
]

const javalangTypeOptions: DefaultOptionType[] = [
  { label: 'Long', value: 'Long' },
  { label: 'String', value: 'String' },
  { label: 'Integer', value: 'Integer' },
  { label: 'Double', value: 'Double' },
  { label: 'BigDecimal', value: 'BigDecimal' },
  { label: 'Date', value: 'Date' },
  { label: 'Boolean', value: 'Boolean' },
]

const queryTypeOptions: DefaultOptionType[] = [
  { label: '=', value: 'EQ' },
  { label: '!=', value: 'NE' },
  { label: '>', value: 'GT' },
  { label: '>=', value: 'GE' },
  { label: '<', value: 'LT' },
  { label: '<=', value: 'LE' },
  { label: 'LIKE', value: 'LIKE' },
  { label: 'BETWEEN', value: 'BETWEEN' },
]

const htmlTypeOptions: DefaultOptionType[] = [
  { label: '文本框', value: 'input' },
  { label: '数字框', value: 'number' },
  { label: '文本域', value: 'textarea' },
  { label: '下拉框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期控件', value: 'datetime' },
  { label: '上传控件', value: 'upload' },
  { label: '富文本控件', value: 'editor' },
]

const checkboxOptions: DefaultOptionType[] = [{ label: '', value: '1' }]

interface UpdateFormColumnProps {
  value: GenTableColumnModel[]
  onChange: (newColumns: GenTableColumnModel[]) => void
}

const UpdateFormColumn: React.FC<UpdateFormColumnProps> = ({ value, onChange }) => {
  const editableKeys = value.map((item) => item.columnId)

  /**
   * 字典数据
   */
  const { data } = useRequest(dictTypeOptions)
  const dictTypeData: DefaultOptionType[] = (data || [])?.map((item) => ({
    label: item.dictName,
    value: item.dictType,
  }))

  /**
   * 表格列配置
   */
  const columns: ProColumns<GenTableColumnModel>[] = [
    {
      title: '字段列名',
      dataIndex: 'columnName',
      readonly: true,
    },
    {
      title: '字段描述',
      dataIndex: 'columnComment',
      valueType: 'text',
    },
    {
      title: '物理类型',
      dataIndex: 'columnType',
      readonly: true,
    },
    {
      title: 'Ts类型',
      dataIndex: 'tslangType',
      valueType: 'select',
      fieldProps: {
        options: tslangTypeOptions,
      },
    },
    {
      title: 'Java类型',
      dataIndex: 'javalangType',
      valueType: 'select',
      fieldProps: {
        options: javalangTypeOptions,
      },
    },
    {
      title: '属性名称',
      dataIndex: 'fieldName',
      valueType: 'text',
    },
    {
      title: '插入',
      width: '5%',
      dataIndex: 'isInsert',
      valueType: 'checkbox',
      fieldProps: {
        options: checkboxOptions,
      },
    },
    {
      title: '编辑',
      dataIndex: 'isEdit',
      width: '5%',
      valueType: 'checkbox',
      fieldProps: {
        options: checkboxOptions,
      },
    },
    {
      title: '列表',
      dataIndex: 'isList',
      width: '5%',
      valueType: 'checkbox',
      fieldProps: {
        options: checkboxOptions,
      },
    },
    {
      title: '查询',
      dataIndex: 'isQuery',
      width: '5%',
      valueType: 'checkbox',
      fieldProps: {
        options: checkboxOptions,
      },
    },
    {
      title: '查询方式',
      dataIndex: 'queryType',
      valueType: 'select',
      fieldProps: {
        options: queryTypeOptions,
      },
    },
    {
      title: '必填',
      dataIndex: 'isRequired',
      width: '5%',
      valueType: 'checkbox',
      fieldProps: {
        options: checkboxOptions,
      },
    },
    {
      title: '显示类型',
      dataIndex: 'htmlType',
      valueType: 'select',
      fieldProps: {
        options: htmlTypeOptions,
      },
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      valueType: 'select',
      fieldProps: {
        options: dictTypeData,
      },
    },
  ]

  return (
    <>
      <EditableProTable<GenTableColumnModel>
        rowKey="columnId"
        columns={columns}
        value={value}
        recordCreatorProps={false}
        bordered
        cardProps={{ bodyStyle: { padding: 0 } }}
        editable={{
          editableKeys,
          onValuesChange: (_, list) => {
            list.forEach((item: any) => {
              Object.keys(item).forEach((key) => {
                if (Array.isArray(item[key])) {
                  item[key] = item[key][0] || '0'
                }
              })
            })
            onChange(list)
          },
        }}
      />
    </>
  )
}

export default UpdateFormColumn
