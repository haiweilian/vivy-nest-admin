import { Radio, InputNumber, Input, Checkbox, Typography, Flex } from 'antd'
import { range } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'
import { ItemType, OptionType, OptionValue } from './types'

const CronTabItem: React.FC<{
  type: ItemType
  onChange?: (value: string) => void
}> = ({ type, onChange }) => {
  const [optionType, setOptionType] = useState<OptionType>(type === 'second' ? 'ignore' : 'any')
  const [optionValue, setOptionValue] = useState<OptionValue>({
    any: '*',
    scope: {
      start: 2,
      end: 5,
    },
    interval: {
      start: '*',
      step: 5,
    },
    list: [],
  })

  useEffect(() => {
    if (optionType === 'ignore') {
      return onChange?.('')
    }
    if (optionType === 'any') {
      return onChange?.('*')
    }
    if (optionType === 'scope') {
      return onChange?.(`${optionValue.scope.start}-${optionValue.scope.end}`)
    }
    if (optionType === 'interval') {
      const start = optionValue.interval.start.trim()
      return onChange?.(
        `${['0', '*', ''].includes(start) ? '*' : optionValue.interval.start}/${optionValue.interval.step}`
      )
    }
    if (optionType === 'list') {
      if (optionValue.list.length > 0) {
        return onChange?.(optionValue.list.join(','))
      } else {
        return onChange?.('*')
      }
    }
  }, [optionType, optionValue])

  const scope = useMemo<[number, number]>(() => {
    if (type === 'hour') {
      return [0, 23]
    }
    if (type === 'day') {
      return [1, 31]
    }
    if (type === 'month') {
      return [1, 12]
    }
    if (type === 'week') {
      return [0, 7]
    }
    return [0, 59]
  }, [type])

  const interval = useMemo<[number, number]>(() => {
    if (type === 'hour') {
      return [2, 23]
    }
    if (type === 'day') {
      return [2, 31]
    }
    if (type === 'month') {
      return [2, 12]
    }
    if (type === 'week') {
      return [2, 7]
    }
    return [0, 59]
  }, [type])

  const list = useMemo(() => {
    if (type === 'hour') {
      return range(0, 24)
    }
    if (type === 'day') {
      return [...range(1, 32), 'L']
    }
    if (type === 'month') {
      return range(1, 13)
    }
    if (type === 'week') {
      return [...range(0, 8), ...range(1, 8).map((i) => `${i}L`)]
    }
    return range(0, 60)
  }, [type])

  return (
    <Radio.Group
      value={optionType}
      onChange={(e) => setOptionType(e.target.value)}
      className="flex flex-col w-full gap-4"
    >
      {type === 'second' ? <Radio value="ignore">忽略</Radio> : null}

      <Flex>
        <Radio value="any">任意</Radio>
        <Typography.Text code>*</Typography.Text>
      </Flex>

      <Flex align="center">
        <Radio value="scope">范围</Radio>
        <Flex align="center" flex="1" gap="small">
          <InputNumber
            value={optionValue.scope.start}
            min={scope[0]}
            max={scope[1]}
            onChange={(value) => {
              setOptionValue({
                ...optionValue,
                scope: {
                  ...optionValue.scope,
                  start: value!,
                },
              })
            }}
          />
          <Typography.Text code>-</Typography.Text>
          <InputNumber
            value={optionValue.scope.end}
            min={scope[0]}
            max={scope[1]}
            onChange={(value) => {
              setOptionValue({
                ...optionValue,
                scope: {
                  ...optionValue.scope,
                  end: value!,
                },
              })
            }}
          />
        </Flex>
      </Flex>

      <Flex align="center">
        <Radio value="interval">间隔</Radio>
        <Flex align="center" flex="1" gap="small">
          <Input
            style={{ width: '90px' }}
            value={optionValue.interval.start}
            onChange={(e) => {
              setOptionValue({
                ...optionValue,
                interval: {
                  ...optionValue.interval,
                  start: e.target.value,
                },
              })
            }}
          />
          <Typography.Text code>/</Typography.Text>
          <InputNumber
            value={optionValue.interval.step}
            min={interval[0]}
            max={interval[1]}
            onChange={(value) => {
              setOptionValue({
                ...optionValue,
                interval: {
                  ...optionValue.interval,
                  step: value!,
                },
              })
            }}
          />
        </Flex>
      </Flex>

      <Flex align="center">
        <Radio value="list">指定</Radio>
        <Flex align="center" flex="1">
          <Checkbox.Group
            onChange={(value) => {
              setOptionValue({
                ...optionValue,
                list: value,
              })
            }}
          >
            {list.map((item) => (
              <Checkbox key={item} value={item} style={{ width: '50px' }}>
                {item}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Flex>
      </Flex>
    </Radio.Group>
  )
}

export default CronTabItem
