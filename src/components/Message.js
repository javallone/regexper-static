import React from 'react';
import PropTypes from 'prop-types';

//import style from './style.css';

const renderIcon = icon => {
  if (!icon) {
    return;
  }

  if (typeof icon === 'string') {
    return <img src={ icon }/>;
  } else {
    const Icon = icon;
    return <Icon/>;
  }
};

const Message = ({ icon, heading, children }) => (
  <div className="message">
    <h2>{ renderIcon(icon) }{ heading }</h2>
    { children }
  </div>
);

Message.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
    PropTypes.string
  ]),
  heading: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

export default Message;
