import React from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

import ErrorIcon from 'feather-icons/dist/icons/alert-octagon.svg';
import WarningIcon from 'feather-icons/dist/icons/alert-triangle.svg';

const iconTypes = {
  error: ErrorIcon,
  warning: WarningIcon
};

const renderIcon = (type, icon) => {
  icon = icon || iconTypes[type];

  if (!icon) {
    return;
  }

  const Icon = icon;
  return <Icon/>;
};

const Message = ({ type, icon, heading, children }) => (
  <div className={ [ style.message, type && style[type] ].filter(Boolean).join(' ') }>
    <div className={ style.header }>
      <h2>{ renderIcon(type, icon) }{ heading }</h2>
    </div>
    <div className={ style.content }>
      { children }
    </div>
  </div>
);

Message.propTypes = {
  type: PropTypes.oneOf([
    'error',
    'warning'
  ]),
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
