import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'escape',

  code() {
    return this.esc.code.textValue;
  },

  arg() {
    return this.esc.arg.textValue;
  },

  render() {
    this.container.addClass('escape');

    this.label = this.renderLabel(this.container, _.result(this, this.code()));

    this.label.select('rect').attr({
      rx: 3,
      ry: 3
    });
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
    var arg = this.arg();

    if (arg) {
      return 'octal: ' + arg;
    } else {
      return 'null';
    }
  },
  c() {
    return 'ctrl-' + this.arg();
  },
  x() {
    return '0x' + this.arg().toUpperCase();
  },
  u() {
    return 'U+' + this.arg().toUpperCase();
  }
});
