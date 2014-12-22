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
    [this.label, this.ordinal] = _.result(this, this.code);
  },

  // Escape code mappings
  b: ['word boundary', -1],
  B: ['non-word boundary', -1],
  d: ['digit', -1],
  D: ['non-digit', -1],
  f: ['form feed', 0x0c],
  n: ['line feed', 0x0a],
  r: ['carriage return', 0x0d],
  s: ['white space', -1],
  S: ['non-white space', -1],
  t: ['tab', 0x09],
  v: ['vertical tab', 0x0b],
  w: ['word', -1],
  W: ['non-word', -1],
  1: ['Back reference (group = 1)', -1],
  2: ['Back reference (group = 2)', -1],
  3: ['Back reference (group = 3)', -1],
  4: ['Back reference (group = 4)', -1],
  5: ['Back reference (group = 5)', -1],
  6: ['Back reference (group = 6)', -1],
  7: ['Back reference (group = 7)', -1],
  8: ['Back reference (group = 8)', -1],
  9: ['Back reference (group = 9)', -1],
  0() {
    if (this.arg) {
      return [`octal: ${this.arg}`, parseInt(this.arg, 8)];
    } else {
      return ['null', 0];
    }
  },
  c() {
    return [`ctrl-${this.arg}`, -1];
  },
  x() {
    return [`0x${this.arg.toUpperCase()}`, parseInt(this.arg, 16)];
  },
  u() {
    return [`U+${this.arg.toUpperCase()}`, parseInt(this.arg, 16)];
  }
};
