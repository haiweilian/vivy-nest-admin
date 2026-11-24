import { DefaultFooter } from '@ant-design/pro-components'
import React from 'react'

const CURRENT_YEAR = new Date().getFullYear()

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${CURRENT_YEAR} haiweilian`}
      links={[
        {
          key: 'Vivy React',
          title: 'Vivy React',
          href: 'https://github.com/haiweilian/vivy-nest-admin',
          blankTarget: true,
        },
      ]}
    />
  )
}

export default Footer
