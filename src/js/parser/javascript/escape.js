import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'escape',

  codeMap: {
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
    0: (arg) => {
      if (arg) {
        return 'octal: ' + arg;
      } else {
        return 'null';
      }
    },
    c: (arg) => {
      return 'ctrl-' + arg;
    },
    x: (arg) => {
      return '0x' + arg.toUpperCase();
    },
    u: (arg) => {
      return 'U+' + arg.toUpperCase();
    }
  },

  render() {
    var code = this.codeMap[this.esc.code.textValue];

    if (_.isFunction(code)) {
      code = code(this.esc.arg.textValue);
    }

    this.container.addClass('escape');

    this.label = this.render_label(this.container, code);

    this.label.select('rect').attr({
      rx: 3,
      ry: 3
    });
  }
});
