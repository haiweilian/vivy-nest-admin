import { List } from 'antd'
import type { ProfileInfoResult } from '@/apis/system/profile/model'
import UpdateAvatar from './UpdateAvatar'

const UserInfo: React.FC<{ profile: ProfileInfoResult }> = ({ profile }) => {
  return (
    <List>
      <List.Item className="!justify-center">
        <UpdateAvatar profile={profile} />
      </List.Item>
      <List.Item>
        <span>用户名称</span>
        <span>{profile.userName}</span>
      </List.Item>
      <List.Item>
        <span>手机号码</span>
        <span>{profile.phonenumber}</span>
      </List.Item>
      <List.Item>
        <span>用户邮箱</span>
        <span>{profile.email}</span>
      </List.Item>
      <List.Item>
        <span>所属部门</span>
        <span>{profile.dept?.deptName}</span>
      </List.Item>
      <List.Item>
        <span>所属角色</span>
        <span>{profile.roles?.map((role) => role.roleName).join(',')}</span>
      </List.Item>
    </List>
  )
}

export default UserInfo
