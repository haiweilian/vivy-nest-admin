import { PageContainer } from '@ant-design/pro-components'
import { useRequest } from '@umijs/max'
import { getLoginUserInfo } from '@/apis/auth/auth'

const Home = () => {
  const { data } = useRequest(getLoginUserInfo)

  return (
    <PageContainer ghost>
      <div style={{ wordBreak: 'break-all' }}>{JSON.stringify(data)}</div>
    </PageContainer>
  )
}

export default Home
