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
    return new Promise(resolve => {
      const { radius } = this.props;

      this.setBBox({
        width: radius * 2,
        height: radius * 2
      });

      this.setState({
        transform: `translate(${ radius } ${ radius })`
      }, resolve);
    });
  }

  render() {
    const { radius } = this.props;
    const { transform } = this.state || {};

    const circleProps = {
      r: radius,
      style: style.pin,
      transform
    };

    return <circle { ...circleProps }></circle>;
  }
}

Pin.propTypes = {
  radius: PropTypes.number
};

export default Pin;
