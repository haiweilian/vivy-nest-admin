import { App as AntdApp, AppProps } from 'antd'
import type { useAppProps } from 'antd/es/app/context'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

let Modal: Omit<ModalStaticFunctions, 'warn'>
let Message: MessageInstance
let Notification: NotificationInstance

const StaticFunction: React.FC = () => {
  const staticFunction = AntdApp.useApp()
  Modal = staticFunction.modal
  Message = staticFunction.message
  Notification = staticFunction.notification
  return null
}

const App: React.FC<AppProps> & { useApp: () => useAppProps } = ({ children, ...props }: AppProps) => {
  return (
    <AntdApp component={false} {...props}>
      {children}
      <StaticFunction />
    </AntdApp>
  )
}

App.useApp = AntdApp.useApp

export { App, Modal, Message, Notification }
