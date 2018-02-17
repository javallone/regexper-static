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

  renderContent() {
    const { children, quoted } = this.props;
    if (!quoted) {
      return children;
    }

    return <React.Fragment>
      <tspan style={ style.textQuote }>&ldquo;</tspan>
      <tspan>{ children }</tspan>
      <tspan style={ style.textQuote }>&rdquo;</tspan>
    </React.Fragment>;
  }

  render() {
    const { type } = this.props;
    const { transform } = this.state || {};

    const textProps = {
      style: { ...style.text, ...(type ? style[type] : {}) },
      transform,
      ref: this.textRef
    };

    return <text { ...textProps }>
      { this.renderContent() }
    </text>;
  }
}

Text.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  quoted: PropTypes.bool,
  transform: PropTypes.string,
  type: PropTypes.string
};

export default Text;
