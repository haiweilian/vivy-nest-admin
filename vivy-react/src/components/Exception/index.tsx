import { history } from '@umijs/max'
import { Button, Result } from 'antd'

const Exception: React.FC<{ title: string }> = ({ title }) => (
  <Result
    status="error"
    title={title}
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
)

export { Exception }
