import _ from 'lodash';
import Q from 'q';
export default {
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

    return Q.all(_.map(elements, part => {
      return part.render(this.partContainer.group());
    }))
      .then(() => {
        this.spaceVertically(elements, {
          padding: 5
        });

        return this.renderLabeledBox(this.invert() ? 'None of:' : 'One of:', this.partContainer, {
          padding: 5
        });
      });
  },

  _getAnchor() {
    var box = this.container.getBBox(),
        matrix = this.transform().localMatrix;

    return {
      atype: this.type,
      ax: box.x,
      ax2: box.x2,
      ay: matrix.y(0, this.partContainer.getBBox().cy)
    };
  },

  invert() {
    return this._invert.textValue !== '';
  }
};
