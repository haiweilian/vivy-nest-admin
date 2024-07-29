import { useRequest } from '@umijs/max'
import { Row, Col, Card, Tabs } from 'antd'
import { getProfile } from '@/apis/system/profile'
import UpdateInfo from './components/UpdateInfo'
import UpdatePassword from './components/UpdatePassword'
import UserInfo from './components/UserInfo'

const Center = () => {
  const { data, loading } = useRequest(getProfile)
  if (!data) return null

  return (
    <Row>
      <Col span={8}>
        <Card title="基本信息" styles={{ body: { paddingTop: '0px' } }} loading={loading}>
          <UserInfo profile={data} />
        </Card>
      </Col>
      <Col span={15} className="ml-4">
        <Card title="基本资料" styles={{ body: { paddingTop: '0px' } }} loading={loading}>
          <Tabs
            defaultActiveKey="info"
            items={[
              {
                key: 'info',
                label: '基本资料',
                children: <UpdateInfo profile={data} />,
              },
              {
                key: 'password',
                label: '修改密码',
                children: <UpdatePassword />,
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default Center
