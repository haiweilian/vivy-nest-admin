import React from 'react';

const AvatarName: React.FC<{ name: string }> = ({ name }) => {
  return <span className="anticon">{name}</span>;
};

export default AvatarName;
