import _ from 'lodash';

export default {
  type: 'escape',

  _render() {
    return this.renderLabel(this.label)
      .tap(label => {
        label.select('rect').attr({
          rx: 3,
          ry: 3
        });
      });
  },

  setup() {
    this.code = this.properties.esc.properties.code.textValue;
    this.arg = this.properties.esc.properties.arg.textValue;
    this.label = _.result(this, this.code);
  },

  // Escape code mappings
  b: 'word boundary',
  B: 'non-word boundary',
  d: 'digit',
  D: 'non-digit',
  f: 'form feed',
  n: 'line feed',
  r: 'carriage return',
  s: 'white space',
  S: 'non-white space',
  t: 'tab',
  v: 'vertical tab',
  w: 'word',
  W: 'non-word',
  1: 'Back reference (group = 1)',
  2: 'Back reference (group = 2)',
  3: 'Back reference (group = 3)',
  4: 'Back reference (group = 4)',
  5: 'Back reference (group = 5)',
  6: 'Back reference (group = 6)',
  7: 'Back reference (group = 7)',
  8: 'Back reference (group = 8)',
  9: 'Back reference (group = 9)',
  0() {
    if (this.arg) {
      return `octal: ${this.arg}`;
    } else {
      return 'null';
    }
  },
  c() {
    return `ctrl-${this.arg}`;
  },
  x() {
    return `0x${this.arg.toUpperCase()}`;
  },
  u() {
    return `U+${this.arg.toUpperCase()}`;
  }
};
