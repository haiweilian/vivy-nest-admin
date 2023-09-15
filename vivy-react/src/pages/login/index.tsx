import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { useModel, history } from '@umijs/max'
import { App } from 'antd'
import { flushSync } from 'react-dom'
import { login } from '@/apis/auth/login'
import type { LoginParams } from '@/apis/auth/login'
import { Footer } from '@/components/Layout'
import { PageEnum } from '@/enums/pageEnum'
import { setToken } from '@/utils/auth'

const Login = () => {
  const { message } = App.useApp()
  const { initialState, setInitialState } = useModel('@@initialState')

  const fetchUserInfo = async (): Promise<void> => {
    const userInfo = await initialState?.fetchUserInfo?.()
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          ...userInfo,
        }))
      })
    }
  }

  const handleLogin = async (values: LoginParams) => {
    try {
      const token = await login(values)
      setToken(token.access_token)
      await fetchUserInfo()
      message.success('登录成功！')
      history.replace(PageEnum.BASE_HOME)
      window.location.reload()
    } catch (error: any) {
      message.error(error.message || '登录失败，请重试！')
    }
  }

  return (
    <div className="flex flex-col justify-center h-full">
      <div>
        <LoginForm title="Vivy" subTitle="基于 Nest & React 权限管理系统" onFinish={handleLogin}>
          <ProFormText
            name="username"
            initialValue={'admin'}
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'用户名'}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            initialValue={'Aa@123456'}
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          {/* <Space>
            <ProFormText
              name="code"
              fieldProps={{
                size: 'large',
                prefix: <KeyOutlined className={'prefixIcon'} />,
                autoFocus: true,
              }}
              placeholder={'验证码'}
              rules={[
                {
                  required: true,
                  message: '请输入验证码!',
                },
              ]}
            />
            <img
              className={styles.code}
              src={`data:image/gif;base64,${data?.img}`}
              onClick={refresh}
            />
          </Space> */}

          <div className="mb-5">
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a className="float-right">忘记密码</a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  )
}

export default Login
