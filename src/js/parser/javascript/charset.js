import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset',

  _render() {
    var elements = _.unique(this.parts.elements, part => {
      if (part.literal) {
        return part.literal.textValue;
      } else {
        return part.textValue;
      }
    });

    this.partContainer = this.container.group();

    return Q.all(_.map(elements, (part => {
      return part.render(this.partContainer.group());
    }).bind(this)))
      .then((() => {
        this.spaceVertically(elements, {
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
