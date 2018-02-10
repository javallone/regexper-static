import React from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

const Message = ({ icon, heading, children }) => {
  const IconComponent = icon;
  return <div className={ style.message }>
    <h2>{ IconComponent ? <IconComponent/> : '' }{ heading }</h2>
    { children }
  </div>;
};

Message.propTypes = {
  icon: PropTypes.element,
  heading: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

export default Message;
