import _ from 'lodash';

export default {
  type: 'literal',

  _render() {
    return this.renderLabel(['\u201c', this.literal, '\u201d'])
      .tap(label => {
        var spans = label.selectAll('tspan');

        spans[0].addClass('quote');
        spans[2].addClass('quote');

        label.select('rect').attr({
          rx: 3,
          ry: 3
        });
      });
  },

  merge(other) {
    this.literal += other.literal;
  },

  setup() {
    this.literal = this.properties.literal.textValue;
    this.ordinal = this.literal.charCodeAt(0);
  }
};
