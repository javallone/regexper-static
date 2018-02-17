/* eslint-disable react/prop-types */

import React from 'react';

import reflowable from 'components/SVG/reflowable';

@reflowable
class SVGElement extends React.PureComponent {
  reflow() {
    return this.setBBox(this.props.bbox);
  }

  render() {
    return <text>Mock content</text>;
  }
}

export default SVGElement;
