import React from 'react';
import PropTypes from 'prop-types';

import Base from './Base';
import style from './style';

const namespaceProps = {
  'xmlns': 'http://www.w3.org/2000/svg',
  'xmlns:cc': 'http://creativecommons.org/ns#',
  'xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
};
const metadata = `<rdf:rdf>
 <cc:license rdf:about="http://creativecommons.org/licenses/by/3.0/">
    <cc:permits rdf:resource="http://creativecommons.org/ns#Reproduction"></cc:permits>
    <cc:permits rdf:resource="http://creativecommons.org/ns#Distribution"></cc:permits>
    <cc:requires rdf:resource="http://creativecommons.org/ns#Notice"></cc:requires>
    <cc:requires rdf:resource="http://creativecommons.org/ns#Attribution"></cc:requires>
    <cc:permits rdf:resource="http://creativecommons.org/ns#DerivativeWorks"></cc:permits>
  </cc:license>
</rdf:rdf>`;

/** @extends React.PureComponent */
class Image extends Base {
  static defaultProps = {
    padding: 10
  }

  publishedMarkup = ''

  state = {
    width: 0,
    height: 0
  }

  preReflow() {
    return this.contained;
  }

  reflow() {
    return new Promise(resolve => {
      const { padding } = this.props;
      const box = this.contained.getBBox();

      this.setState({
        width: Math.round(box.width + 2 * padding),
        height: Math.round(box.height + 2 * padding)
      }, resolve);
    });
  }

  containedRef = contained => this.contained = contained

  svgRef = svg => this.svg = svg

  render() {
    const { width, height } = this.state;
    const { padding, children } = this.props;

    const svgProps = {
      width,
      height,
      viewBox: [0, 0, width, height].join(' '),
      style: style.image,
      ref: this.svgRef,
      ...namespaceProps
    };

    return <svg { ...svgProps }>
      <metadata dangerouslySetInnerHTML={{ __html: metadata }}></metadata>
      <g transform={ `translate(${ padding } ${ padding })` }>
        { React.cloneElement(React.Children.only(children), {
          ref: this.containedRef
        }) }
      </g>
    </svg>;
  }
}

Image.propTypes = {
  children: PropTypes.node,
  padding: PropTypes.number
};

export default Image;
