import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import Base from './Base';
import style from './style';
import Path from './path';

/** @extends React.PureComponent */
class HorizontalLayout extends Base {
  static defaultProps = {
    withConnectors: false,
    spacing: 10
  }

  constructor(props) {
    super(props);
    this.state = {
      childTransforms: List()
    };
  }

  updateChildTransforms(childBoxes) {
    return childBoxes.reduce((transforms, box, i) => (
      transforms.set(i, `translate(${ box.offsetX } ${ box.offsetY })`)
    ), this.state.childTransforms);
  }

  updateConnectorPaths(childBoxes) {
    let last = childBoxes[0];

    return childBoxes.slice(1).reduce((path, box) => {
      try {
        return path
          .moveTo({ x: last.offsetX + last.axisX2, y: this.getBBox().axisY })
          .lineTo({ x: box.offsetX + box.axisX1 });
      }
      finally {
        last = box;
      }
    }, new Path()).toString();
  }

  preReflow() {
    return this.children;
  }

  reflow() {
    if (this.children.length === 0) {
      return;
    }

    return new Promise(resolve => {
      const { spacing, withConnectors } = this.props;

      const childBoxes = this.children.map(child => child.getBBox());
      const verticalCenter = childBoxes.reduce((center, box) => Math.max(center, box.axisY), 0);
      const width = childBoxes.reduce((width, box) => width + box.width, 0) + (childBoxes.length - 1) * spacing;
      const height = childBoxes.reduce((ascHeight, box) => Math.max(ascHeight, box.axisY), 0) +
                     childBoxes.reduce((decHeight, box) => Math.max(decHeight, box.height - box.axisY), 0);
      this.setBBox({ width, height, axisY: verticalCenter }, { axisX1: true, axisX2: true });

      let offset = 0;
      childBoxes.forEach(box => {
        box.offsetX = offset;
        box.offsetY = this.getBBox().axisY - box.axisY;
        offset += box.width + spacing;
      });

      this.setState({
        childTransforms: this.updateChildTransforms(childBoxes),
        connectorPaths: withConnectors ? this.updateConnectorPaths(childBoxes) : ''
      }, resolve);
    });
  }

  childRef = i => child => this.children[i] = child

  render() {
    const { children } = this.props;
    const { childTransforms, connectorPaths } = this.state;

    this.children = [];

    return <React.Fragment>
      <path d={ connectorPaths } style={ style.connectors }></path>
      { React.Children.map(children, (child, i) => (
        <g transform={ childTransforms.get(i) }>
          { React.cloneElement(child, {
            ref: this.childRef(i)
          }) }
        </g>
      ))}
    </React.Fragment>;
  }
}

HorizontalLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  spacing: PropTypes.number,
  withConnectors: PropTypes.bool
};

export default HorizontalLayout;
