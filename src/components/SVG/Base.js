import React from 'react';
import { Map } from 'immutable';

class Base extends React.PureComponent {
  _currentBBox() {
    return this.tempBBox ? this.tempBBox : (this.state || {}).bbox;
  }

  setStateAsync(state) {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  }

  async setBBox(box, recalculate = {}) {
    let bbox = this._currentBBox() || Map({ width: 0, height: 0});

    bbox = bbox.merge(box);

    if (!bbox.has('axisY') || recalculate.axisY) {
      bbox = bbox.set('axisY', bbox.get('height') / 2);
    }

    if (!bbox.has('axisX1') || recalculate.axisX1) {
      bbox = bbox.set('axisX1', 0);
    }

    if (!bbox.has('axisX2') || recalculate.axisX2) {
      bbox = bbox.set('axisX2', bbox.get('width'));
    }

    this.tempBBox = bbox; // Want to get the updated bbox while setState is pending
    await this.setStateAsync({ bbox });
    this.tempBBox = null;
  }

  getBBox() {
    const bbox = this._currentBBox() || Map();
    return {
      width: 0,
      height: 0,
      axisY: 0,
      axisX1: 0,
      axisX2: 0,
      ...bbox.toJS()
    };
  }

  async doPreReflow() {
    const components = this.preReflow();

    // No child components
    if (components === undefined) {
      return true;
    }

    // List of child components
    if (components.map) {
      const componentsReflowed = await Promise.all(components.map(c => c.doReflow()));

      return componentsReflowed.reduce((memo, value) => memo || value, false);
    }

    // One child component
    return components.doReflow();
  }

  async doReflow() {
    const oldBBox = this._currentBBox();
    const shouldReflow = await this.doPreReflow();

    if (shouldReflow) {
      this.reflow();
    }

    return this._currentBBox() !== oldBBox;
  }

  preReflow() {
    // Implemented in subclass, return array of components to reflow before this
  }

  reflow() {
    // Implemented in subclasses
  }
}

export default Base;
