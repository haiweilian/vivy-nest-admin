import { useModel } from '@umijs/max'
import { Avatar, Card, Typography } from 'antd'

const Header: React.FC = () => {
  const { initialState } = useModel('@@initialState')
  const userInfo = initialState?.userInfo

  return (
    <Card className="w-full">
      <div className="flex">
        <Avatar src={userInfo?.avatar} size={72} />
        <div className="flex flex-col justify-center ml-6">
          <h1 className="text-lg">早安, {userInfo?.nickName}, 开始您一天的工作吧！</h1>
          <Typography.Text type="secondary"> 今日晴，20℃ - 32℃！ </Typography.Text>
        </div>
        <div className="flex justify-end flex-1">
          <div className="flex flex-col justify-center text-right">
            <Typography.Text type="secondary"> 待办 </Typography.Text>
            <span className="text-2xl">3</span>
          </div>
          <div className="flex flex-col justify-center mx-16 text-right">
            <Typography.Text type="secondary"> 项目 </Typography.Text>
            <span className="text-2xl">6</span>
          </div>
          <div className="flex flex-col justify-center mr-10 text-right">
            <Typography.Text type="secondary"> 团队 </Typography.Text>
            <span className="text-2xl">9</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Header
