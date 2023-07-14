import React from 'react';
import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${new Date().getFullYear()} haiweilian`}
      links={[
        {
          key: 'Vivy React',
          title: 'Vivy React',
          href: 'https://github.com/nest-micro/vivy-react',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
