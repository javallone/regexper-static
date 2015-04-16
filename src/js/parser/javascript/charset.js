import util from '../../util.js';
import _ from 'lodash';
export default {
  type: 'charset',

  definedProperties: {
    _anchor: {
      get: function() {
        var matrix = this.transform().localMatrix;

        return {
          ay: matrix.y(0, this.partContainer.getBBox().cy)
        };
      }
    }
  },

  _render() {
    this.partContainer = this.container.group();

    return Promise.all(_.map(this.elements, part => {
      return part.render(this.partContainer.group());
    }))
      .then(() => {
        util.spaceVertically(this.elements, {
          padding: 5
        });

        return this.renderLabeledBox(this.label, this.partContainer, {
          padding: 5
        });
      });
  },

  setup() {
    this.label = (this.properties.invert.textValue === '^') ? 'None of:' : 'One of:';
    this.elements = _.unique(this.properties.parts.elements, part => {
      return [part.type, part.textValue].join(':');
    });

    if (this.textValue.match(/\\c[^a-zA-Z]/)) {
      this.state.warnings.push(`The character set "${this.textValue}" contains the \\c escape followed by a character other than A-Z. This can lead to different behavior depending on browser. The representation here is the most common interpretation.`);
    }
  }
}
