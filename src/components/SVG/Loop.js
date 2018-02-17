import React from 'react';
import PropTypes from 'prop-types';

import Base from './Base';
import style from './style';
import Path from './path';

const skipPath = (box, greedy) => {
  const vert = Math.max(0, box.axisY - 10);
  const horiz = box.width - 10;

  let path = new Path({ relative: true });

  if (!greedy) {
    path
      .moveTo({ x: 10, y: box.axisY + box.offsetY - 15, relative: false })
      .lineTo({ x: 5, y: 5 })
      .moveTo({ x: -5, y: -5 })
      .lineTo({ x: -5, y: 5 });
  }

  return path
    .moveTo({ x: 0, y: box.axisY + box.offsetY, relative: false })
    .quadraticCurveTo({ cx: 10, cy: 0, x: 10, y: -10 })
    .lineTo({ y: -vert })
    .quadraticCurveTo({ cx: 0, cy: -10, x: 10, y: -10 })
    .lineTo({ x: horiz })
    .quadraticCurveTo({ cx: 10, cy: 0, x: 10, y: 10 })
    .lineTo({ y: vert })
    .quadraticCurveTo({ cx: 0, cy: 10, x: 10, y: 10 });
};

const repeatPath = (box, greedy) => {
  const vert = box.height - box.axisY - 10;

  let path = new Path({ relative: true });

  if (greedy) {
    path
      .moveTo({ x: box.offsetX + box.width + 10, y: box.axisY + box.offsetY + 15, relative: false })
      .lineTo({ x: 5, y: -5 })
      .moveTo({ x: -5, y: 5 })
      .lineTo({ x: -5, y: -5 });
  }

  return path
    .moveTo({ x: box.offsetX, y: box.axisY + box.offsetY, relative: false })
    .quadraticCurveTo({ cx: -10, cy: 0, x: -10, y: 10 })
    .lineTo({ y: vert })
    .quadraticCurveTo({ cx: 0, cy: 10, x: 10, y: 10 })
    .lineTo({ x: box.width })
    .quadraticCurveTo({ cx: 10, cy: 0, x: 10, y: -10 })
    .lineTo({ y: -vert })
    .quadraticCurveTo({ cx: 0, cy: -10, x: -10, y: -10 });
};

/** @extends React.PureComponent */
class Loop extends Base {
  get contentOffset() {
    const { skip, repeat } = this.props;

    if (skip) {
      return { x: 15, y: 10 };
    } else if (repeat) {
      return { x: 10, y: 0 };
    } else {
      return { x: 0, y: 0 };
    }
  }

  preReflow() {
    return this.contained;
  }

  reflow() {
    return new Promise(resolve => {
      const { skip, repeat, greedy } = this.props;
      const box = this.contained.getBBox();
      const labelBox = this.label ? this.label.getBBox() : { width: 0, height: 0 };

      let height = box.height + labelBox.height;
      if (skip) {
        height += 10;
      }
      if (repeat) {
        height += 10;
      }

      this.setBBox({
        width: box.width + this.contentOffset.x * 2,
        height,
        axisY: box.axisY + this.contentOffset.y,
        axisX1: box.axisX1 + this.contentOffset.x,
        axisX2: box.axisX2 + this.contentOffset.x
      });

      box.offsetX = this.contentOffset.x;
      box.offsetY = this.contentOffset.y;

      this.setState({
        labelTransform: `translate(${ this.getBBox().width - labelBox.width - 10 } ${ this.getBBox().height + 2 })`,
        loopPaths: [
          skip && skipPath(box, greedy),
          repeat && repeatPath(box, greedy)
        ].filter(Boolean).join('')
      }, resolve);
    });
  }

  containedRef = contained => this.contained = contained

  labelRef = label => this.label = label

  render() {
    const { label, children } = this.props;
    const { loopPaths, labelTransform } = this.state || {};

    const textProps = {
      transform: labelTransform,
      style: style.infoText,
      ref: this.labelRef
    };

    return <React.Fragment>
      <path d={ loopPaths } style={ style.connectors }></path>
      { label && <text { ...textProps }>{ label }</text> }
      <g transform={ `translate(${ this.contentOffset.x } ${ this.contentOffset.y })` }>
        { React.cloneElement(React.Children.only(children), {
          ref: this.containedRef
        }) }
      </g>
    </React.Fragment>;
  }
}

Loop.propTypes = {
  children: PropTypes.node.isRequired,
  greedy: PropTypes.bool,
  label: PropTypes.string,
  skip: PropTypes.bool,
  repeat: PropTypes.bool
};

export default Loop;
