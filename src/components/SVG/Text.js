import React from 'react';
import PropTypes from 'prop-types';

import Base from './Base';
import style from './style';

/** @extends React.PureComponent */
class Text extends Base {
  reflow() {
    const box = this.text.getBBox();

    this.setBBox({
      width: box.width,
      height: box.height
    });

    return this.setStateAsync({
      transform: `translate(${-box.x} ${-box.y})`
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
    const { theme } = this.props;
    const { transform } = this.state || {};

    const textProps = {
      style: { ...style.text, ...style[theme] },
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
  theme: PropTypes.string
};

export default Text;
