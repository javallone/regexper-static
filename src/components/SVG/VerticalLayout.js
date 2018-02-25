import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import style from './style';

import reflowable from './reflowable';
import Path from './path';

const connectorMargin = 20;

@reflowable
class VerticalLayout extends React.PureComponent {
  static defaultProps = {
    withConnectors: false,
    spacing: 10
  }

  state = {
    childTransforms: List()
  }

  updateChildTransforms(childBoxes) {
    return this.state.childTransforms.withMutations(transforms => (
      childBoxes.forEach((box, i) => (
        transforms.set(i, `translate(${ box.offsetX } ${ box.offsetY })`)
      ))
    ));
  }

  makeCurve(box) {
    const thisBox = this.getBBox();
    const distance = Math.abs(box.offsetY + box.axisY - thisBox.axisY);

    if (distance >= 15) {
      const curve = (box.axisY + box.offsetY > thisBox.axisY) ? 10 : -10;

      return new Path()
        // Left
        .moveTo({ x: 10, y: box.axisY + box.offsetY - curve })
        .quadraticCurveTo({ cx: 0, cy: curve, x: 10, y: curve, relative: true })
        .lineTo({ x: box.offsetX + box.axisX1 })
        // Right
        .moveTo({ x: thisBox.width - 10, y: box.axisY + box.offsetY - curve })
        .quadraticCurveTo({ cx: 0, cy: curve, x: -10, y: curve, relative: true })
        .lineTo({ x: box.offsetX + box.axisX2 });
    } else {
      const anchor = box.offsetY + box.axisY - thisBox.axisY;

      return new Path()
        // Left
        .moveTo({ x: 0, y: thisBox.axisY })
        .cubicCurveTo({ cx1: 15, cy1: 0, cx2: 10, cy2: anchor, x: 20, y: anchor, relative: true })
        .lineTo({ x: box.offsetX + box.axisX1 })
        // Right
        .moveTo({ x: thisBox.width, y: thisBox.axisY })
        .cubicCurveTo({ cx1: -15, cy1: 0, cx2: -10, cy2: anchor, x: -20, y: anchor, relative: true })
        .lineTo({ x: box.offsetX + box.axisX2 });
    }
  }

  makeSide(box) {
    const thisBox = this.getBBox();
    const distance = Math.abs(box.offsetY + box.axisY - thisBox.axisY);

    if (distance >= 15) {
      const shift = (box.offsetY + box.axisY > thisBox.axisY) ? 10 : -10;
      const edge = box.offsetY + box.axisY - shift;

      return new Path()
        // Left
        .moveTo({ x: 0, y: thisBox.axisY })
        .quadraticCurveTo({ cx: 10, cy: 0, x: 10, y: shift, relative: true })
        .lineTo({ y: edge })
        // Right
        .moveTo({ x: thisBox.width, y: thisBox.axisY })
        .quadraticCurveTo({ cx: -10, cy: 0, x: -10, y: shift, relative: true })
        .lineTo({ y: edge });
    }
  }

  reflow() {
    const { spacing, withConnectors } = this.props;

    const childBoxes = this.children.map(child => child.getBBox());
    const horizontalCenter = childBoxes.reduce((center, box) => Math.max(center, box.width / 2), 0);
    const margin = withConnectors ? connectorMargin : 0;
    const width = childBoxes.reduce((width, box) => Math.max(width, box.width), 0) + 2 * margin;
    const height = childBoxes.reduce((height, box) => height + box.height, 0) + (childBoxes.length - 1) * spacing;
    this.setBBox({ width, height }, { axisY: true, axisX1: true, axisX2: true });

    let offset = 0;
    childBoxes.forEach(box => {
      box.offsetX = horizontalCenter - box.width / 2 + margin;
      box.offsetY = offset;
      offset += spacing + box.height;
    });

    this.setStateAsync({
      childTransforms: this.updateChildTransforms(childBoxes),
      connectorPaths: withConnectors ? [
        ...childBoxes.map(box => this.makeCurve(box)),
        this.makeSide(childBoxes[0]),
        this.makeSide(childBoxes[childBoxes.length - 1])
      ].join('') : ''
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
      )) }
    </React.Fragment>;
  }
}

VerticalLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  spacing: PropTypes.number,
  withConnectors: PropTypes.bool
};

export default VerticalLayout;
