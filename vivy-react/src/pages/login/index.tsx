import { KeyOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components'
import { useModel, useRequest } from '@umijs/max'
import { App, Space } from 'antd'
import { flushSync } from 'react-dom'
import { login, captchaImage } from '@/apis/auth/login'
import type { LoginParams } from '@/apis/auth/login'
import { PageEnum } from '@/enums/pageEnum'
import { Footer } from '@/layouts/default'
import { setToken } from '@/utils/auth'

const Login = () => {
  const { message } = App.useApp()
  const { initialState, setInitialState } = useModel('@@initialState')
  const { data: captcha, run: runCaptchaImage } = useRequest(captchaImage)

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
      const token = await login({
        ...values,
        uuid: captcha?.uuid,
      })
      setToken(token.access_token)
      await fetchUserInfo()
      message.loading('登录中...')
      window.location.href = PageEnum.BASE_HOME
    } catch (error: any) {
      message.error(error.message || '登录失败，请重试！')
    }
  }

  return (
    <div className="flex flex-col justify-center h-[100vh]">
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
          {captcha ? (
            <Space>
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
              <div
                className="flex cursor-pointer mb-[24px]"
                dangerouslySetInnerHTML={{ __html: captcha.img }}
                onClick={runCaptchaImage}
              />
            </Space>
          ) : null}
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
