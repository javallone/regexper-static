import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset',

  _render() {
    this.renderLabeledBox(this.invert() ? 'None of:' : 'One of:');

    this.partContainer = this.container.group();

    return Q.all(_.map(this.parts.elements, (part => {
      return part.render(this.partContainer.group());
    }).bind(this)));
  },

  _position() {
    this.spaceVertically(this.parts.elements, {
      padding: 5
    });

    this.positionLabeledBox(this.partContainer, {
      padding: 5
    });
  },

  invert() {
    return this._invert.textValue !== '';
  }
});
