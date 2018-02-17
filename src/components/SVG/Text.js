import React from 'react';
import PropTypes from 'prop-types';

import Base from './Base';
import style from './style';

/** @extends React.PureComponent */
class Text extends Base {
  reflow() {
    return new Promise(resolve => {
      const box = this.text.getBBox();

      this.setBBox({
        width: box.width,
        height: box.height
      });

      this.setState({
        transform: `translate(${-box.x} ${-box.y})`
      }, resolve);
    });
  }

  textRef = text => this.text = text

  render() {
    const { transform } = this.state || {};
    const { style: styleProp, children } = this.props;

    const textProps = {
      style: { ...style.text, ...styleProp },
      transform,
      ref: this.textRef
    };

    return <text { ...textProps }>
      { children }
    </text>;
  }
}

Text.propTypes = {
  style: PropTypes.object,
  transform: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default Text;
