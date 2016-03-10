// Charset nodes are used for `[abc1-9]` regular expression syntax. It is
// rendered as a labeled box with each literal, escape, and range rendering
// handled by the nested node(s).

import util from '../../util.js';
import _ from 'lodash';

export default {
  type: 'charset',

  definedProperties: {
    // Default anchor is overridden to move it down so that it connects at the
    // middle of the box that wraps all of the charset parts, instead of the
    // middle of the container, which would take the label into account.
    _anchor: {
      get: function() {
        var matrix = this.transform().localMatrix;

        return {
          ay: matrix.y(0, this.partContainer.getBBox().cy)
        };
      }
    }
  },

  // Renders the charset into the currently set container.
  _render() {
    this.partContainer = this.container.group();

    // Renders each part of the charset into the part container.
    return Promise.all(_.map(this.elements, part => {
      return part.render(this.partContainer.group());
    }))
      .then(() => {
        // Space the parts of the charset vertically in the part container.
        util.spaceVertically(this.elements, {
          padding: 5
        });

        // Label the part container.
        return this.renderLabeledBox(this.label, this.partContainer, {
          padding: 5
        });
      });
  },

  setup() {
    // The label for the charset will be:
    // - "One of:" for charsets of the form: `[abc]`.
    // - "None of:" for charsets of the form: `[^abc]`.
    this.label = (this.properties.invert.textValue === '^') ? 'None of:' : 'One of:';

    // Removes any duplicate parts from the charset. This is based on the type
    // and text value of the part, so `[aa]` will have only one item, but
    // `[a\x61]` will contain two since the first matches "a" and the second
    // matches 0x61 (even though both are an "a").
    this.elements = _.uniqBy(this.properties.parts.elements, part => {
      return `${part.type}:${part.textValue}`;
    });

    // Include a warning for charsets that attempt to match `\c` followed by
    // any character other than A-Z (case insensitive). Charsets like `[\c@]`
    // behave differently in different browsers. Some match the character
    // reference by the control charater escape, others match "\", "c", or "@",
    // and some do not appear to match anything.
    if (this.textValue.match(/\\c[^a-zA-Z]/)) {
      this.state.warnings.push(`The character set "${this.textValue}" contains the \\c escape followed by a character other than A-Z. This can lead to different behavior depending on browser. The representation here is the most common interpretation.`);
    }
  }
}
