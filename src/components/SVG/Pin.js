import React from 'react';
import PropTypes from 'prop-types';

import style from './style';

import reflowable from './reflowable';

@reflowable
class Pin extends React.PureComponent {
  static defaultProps = {
    radius: 5
  }

  reflow() {
    const { radius } = this.props;

    this.setBBox({
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
