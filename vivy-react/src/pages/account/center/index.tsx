import { useRequest } from '@umijs/max'
import { Row, Col, Card, Tabs } from 'antd'
import { getLoginUserInfo } from '@/apis/auth/auth'
import UpdateInfo from './components/UpdateInfo'
import UpdatePassword from './components/UpdatePassword'
import UserInfo from './components/UserInfo'

const Center = () => {
  const { data, loading } = useRequest(getLoginUserInfo)
  if (!data) return null

  return (
    <Row>
      <Col span={8}>
        <Card title="基本信息" bodyStyle={{ paddingTop: '0px' }} loading={loading}>
          <UserInfo user={data.sysUser} />
        </Card>
      </Col>
      <Col span={15} className="ml-4">
        <Card title="基本资料" bodyStyle={{ paddingTop: '0px' }} loading={loading}>
          <Tabs
            defaultActiveKey="info"
            items={[
              {
                key: 'info',
                label: '基本资料',
                children: <UpdateInfo user={data.sysUser} />,
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
