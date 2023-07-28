import { List, Avatar } from 'antd'

const UserInfo: React.FC<{ user: UserInfo }> = ({ user }) => {
  return (
    <List>
      <List.Item className="!justify-center">
        <Avatar
          size={100}
          src="https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
        />
      </List.Item>
      <List.Item>
        <span>用户名称</span>
        <span>{user.userName}</span>
      </List.Item>
      <List.Item>
        <span>手机号码</span>
        <span>{user.phonenumber}</span>
      </List.Item>
      <List.Item>
        <span>用户邮箱</span>
        <span>{user.email}</span>
      </List.Item>
      <List.Item>
        <span>所属部门</span>
        {/* <span>{user.dept.deptName}</span> */}
      </List.Item>
      <List.Item>
        <span>所属角色</span>
        {/* <span>{user.roles[0].roleName}</span> */}
      </List.Item>
    </List>
  )
}

export default UserInfo
