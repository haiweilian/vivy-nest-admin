import { PlusOutlined } from '@ant-design/icons'
import { ProFormSelect } from '@ant-design/pro-components'
import { Button, Divider, Input, InputRef, Space } from 'antd'
import { useRef, useState } from 'react'

const UseSelect: React.FC<{
  options: string[]
  onChange: (value: string[]) => void
}> = ({ options, onChange }) => {
  const [name, setName] = useState('')
  const inputRef = useRef<InputRef>(null)

  const addOption = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault()
    onChange([...options, name])
    setName('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  return (
    <ProFormSelect
      name="fileUse"
      label="文件用途"
      required
      rules={[{ required: true }]}
      fieldProps={{
        options: options.map((item) => ({ label: item, value: item })),
        showSearch: true,
        dropdownRender(menu) {
          return (
            <>
              <Space style={{ padding: '0px 2px' }}>
                <Input
                  placeholder="新增文件用途"
                  ref={inputRef}
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  disabled={!name || options.includes(name)}
                  onClick={addOption}
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
  )
}

export default UseSelect
