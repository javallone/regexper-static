// Literal nodes are for plain strings in the regular expression. They are
// rendered as labels with the value of the literal quoted.

import _ from 'lodash';

export default {
  type: 'literal',

  // Renders the literal into the currently set container.
  _render() {
    return this.renderLabel(['\u201c', this.literal, '\u201d'])
      .then(label => {
        let spans = label.selectAll('tspan');

        // The quote marks get some styling to lighten their color so they are
        // distinct from the actual literal value.
        spans[0].addClass('quote');
        spans[2].addClass('quote');

        label.select('rect').attr({
          rx: 3,
          ry: 3
        });

        return label;
      });
  },

  // Merges this literal with another. Literals come back as single characters
  // during parsing, and must be post-processed into multi-character literals
  // for rendering. This processing is done in [Match](./match.html).
  merge(other) {
    this.literal += other.literal;
  },

  setup() {
    // Value of the literal.
    this.literal = this.properties.literal.textValue;
    // Ordinal value of the literal for use in
    // [CharsetRange](./charset_range.html).
    this.ordinal = this.literal.charCodeAt(0);
  }
};
