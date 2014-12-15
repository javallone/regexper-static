import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset',

  _render() {
    this.partContainer = this.container.group();

    return Q.all(_.map(this.parts.elements, (part => {
      return part.render(this.partContainer.group());
    }).bind(this)))
      .then((() => {
        this.spaceVertically(this.parts.elements, {
          padding: 5
        });

        return this.renderLabeledBox(this.invert() ? 'None of:' : 'One of:', this.partContainer, {
          padding: 5
        });
      }).bind(this));
  },

  _getAnchor() {
    var matrix = this.transform().localMatrix;

    return _.extend(Base._getAnchor.call(this), {
      ay: matrix.y(0, this.partContainer.getBBox().cy)
    });
  },

  invert() {
    return this._invert.textValue !== '';
  }
});
