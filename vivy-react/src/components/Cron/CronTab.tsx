import { Col, Row } from 'antd'
import { useState } from 'react'
import CronEval from './CronEval'
import CronGen from './CronGen'

const CronTab: React.FC<{
  onChange?: (value: string) => void
}> = ({ onChange }) => {
  const [value, setValue] = useState<string>()
  return (
    <Row>
      <Col span={14}>
        <CronGen
          onChange={(value) => {
            setValue(value)
            onChange?.(value)
          }}
        />
      </Col>
      <Col span={10}>
        <CronEval value={value} />
      </Col>
    </Row>
  )
}

export default CronTab
