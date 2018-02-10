import React from 'react';

import style from './style.css';

const Message = ({ icon, heading, children }) => {
  const IconComponent = icon;
  return <div className={ style.message }>
    <h2>{ IconComponent ? <IconComponent/> : '' }{ heading }</h2>
    { children }
  </div>;
};

export default Message;
