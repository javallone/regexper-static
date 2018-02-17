import React from 'react';

import Base from 'components/SVG/Base';

class SVGElement extends Base {
  reflow() {
    return this.setBBox(this.props.bbox);
  }

  render() {
    return <text>Mock content</text>;
  }
}

export default SVGElement;
