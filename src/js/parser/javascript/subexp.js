import _ from 'lodash';
import Base from './base.js';

var groupCounter = 1;

export default _.extend({}, Base, {
  type: 'subexp',

  labelMap: {
    '?:': '',
    '?=': 'positive lookahead',
    '?!': 'negative lookahead'
  },

  _render() {
    var label = this.groupLabel();

    if (label) {
      this.renderLabeledBox(label);

      return this.regexp.render(this.container.group());
    } else {
      return this.proxy(this.regexp);
    }
  },

  _position() {
    this.positionLabeledBox(this.regexp, {
      padding: 10
    });
  },

  groupLabel() {
    if (_.has(this.labelMap, this._capture.textValue)) {
      return this.labelMap[this._capture.textValue];
    } else {
      return 'group #' + (groupCounter++);
    }
  },

  resetCounter() {
    groupCounter = 1;
  },
});
