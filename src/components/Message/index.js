import React from 'react';
import PropTypes from 'prop-types';

const renderIcon = icon => {
  if (!icon) {
    return;
  }

  const Icon = icon;
  return <Icon/>;
};

const Message = ({ className, icon, heading, children }) => (
  <div className={ ['message', className].filter(Boolean).join(' ') }>
    <div className="header">
      <h2>{ renderIcon(icon) }{ heading }</h2>
    </div>
    <div className="content">
      { children }
    </div>
  </div>
);

Message.propTypes = {
  className: PropTypes.string,
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
