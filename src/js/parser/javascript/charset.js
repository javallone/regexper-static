import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset',

  _render() {
    var partContainer = this.container.group();

    return Q.all(_.map(this.parts.elements, part => {
      return part.render(partContainer.group());
    }))
      .then((() => {
        this.spaceVertically(this.parts.elements, {
          padding: 5
        });

        return this.renderLabeledBox(this.invert() ? 'None of:' : 'One of:', partContainer, {
          padding: 5
        });
      }).bind(this));
  },

  invert() {
    return this._invert.textValue !== '';
  }
});
