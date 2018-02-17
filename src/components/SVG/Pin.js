import React from 'react';
import PropTypes from 'prop-types';

import Base from './Base';
import style from './style';

/** @extends React.PureComponent */
class Pin extends Base {
  static defaultProps = {
    radius: 5
  }

  reflow() {
    const { radius } = this.props;

    return this.setBBox({
      width: radius * 2,
      height: radius * 2
    });
  }

  render() {
    const { radius } = this.props;

    const circleProps = {
      r: radius,
      style: style.pin,
      transform: `translate(${ radius } ${ radius })`
    };

    return <circle { ...circleProps }></circle>;
  }
}

Pin.propTypes = {
  radius: PropTypes.number
};

export default Pin;
