import React from 'react';
import PropTypes from 'prop-types';

const renderIcon = icon => {
  if (!icon) {
    return;
  }

  const Icon = icon;
  return <Icon/>;
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
    PropTypes.func
  ]),
  heading: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default Message;
