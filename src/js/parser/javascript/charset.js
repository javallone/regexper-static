import _ from 'lodash';
import Q from 'q';
export default {
  type: 'charset',

  definedProperties: {
    _anchor: {
      get: function() {
        var box = this.container.getBBox(),
            matrix = this.transform().localMatrix;

        return {
          ax: box.x,
          ax2: box.x2,
          ay: matrix.y(0, this.partContainer.getBBox().cy)
        };
      }
    }
  },

  _render() {
    this.partContainer = this.container.group();

    return Q.all(_.map(this.elements, part => {
      return part.render(this.partContainer.group());
    }))
      .then(() => {
        this.spaceVertically(this.elements, {
          padding: 5
        });

        return this.renderLabeledBox(this.invert ? 'None of:' : 'One of:', this.partContainer, {
          padding: 5
        });
      });
  },

  setup() {
    this.invert = this.properties.invert !== '';
    this.elements = _.unique(this.properties.parts.elements, part => {
      if (part.literal) {
        return part.literal.textValue;
      } else {
        return part.textValue;
      }
    });
  }
};
