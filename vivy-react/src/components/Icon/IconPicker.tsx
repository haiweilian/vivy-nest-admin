import { Icon } from '@umijs/max'
import { Popover, Space, Button, Input } from 'antd'
import React, { useState, useMemo } from 'react'
import names from '../../../config/icons/icon.ant'

interface IconPickerProps {
  children: React.ReactNode
  onChange?: (value: string) => void
}

const IconPicker: React.FC<IconPickerProps> = ({ children, onChange }) => {
  const [search, setSearch] = useState('')
  const icons = useMemo(() => {
    if (search) {
      return names.filter((name) => name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    }
    return names
  }, [search])

  return (
    <Popover
      content={
        <div className="flex flex-col">
          <Input.Search className="mb-4" placeholder="搜索图标" enterButton="搜索" onSearch={setSearch} />
          <div
            style={{
              width: '400px',
              height: '200px',
              overflow: 'auto',
            }}
          >
            <Space wrap align="start">
              {icons.map((name) => (
                <Button key={name} icon={<Icon icon={name as any} />} onClick={() => onChange?.(name)} />
              ))}
            </Space>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  )
}

export default IconPicker
