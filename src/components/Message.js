import React from 'react';
import PropTypes from 'prop-types';

const renderIcon = icon => {
  if (!icon) {
    return;
  }

  return <img src={ icon }/>;
};

const Message = ({ icon, heading, children }) => (
  <div className="message">
    <h2>{ renderIcon(icon) }{ heading }</h2>
    { children }
  </div>
);

Message.propTypes = {
  icon: PropTypes.string,
  heading: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

export default Message;
