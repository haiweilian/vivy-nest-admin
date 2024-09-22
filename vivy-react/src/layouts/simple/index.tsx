import { ProConfigProvider } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { ConfigProvider, Layout } from 'antd'
import React from 'react'
import { App } from '@/components/App'

const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialState } = useModel('@@initialState')
  const token = initialState?.settings?.token
  const isDark = initialState?.settings?.navTheme === 'realDark'
  const colorPrimary = initialState?.settings?.colorPrimary

  return (
    <div>
      <ConfigProvider
        theme={
          colorPrimary
            ? {
                token: {
                  colorPrimary,
                },
              }
            : undefined
        }
      >
        <ProConfigProvider autoClearCache dark={isDark} token={token}>
          <Layout>
            <App>{children}</App>
          </Layout>
        </ProConfigProvider>
      </ConfigProvider>
    </div>
  )
}

export { SimpleLayout }
