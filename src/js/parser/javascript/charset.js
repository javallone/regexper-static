import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset',

  _render() {
    this.renderLabeledBox(this.invert() ? 'None of:' : 'One of:');

    this.partContainer = this.container.group();

    _.each(this.parts.elements, (part => {
      part.render(this.partContainer.group());
    }).bind(this));
  },

  _position() {
    _.invoke(this.parts.elements, 'position');

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
