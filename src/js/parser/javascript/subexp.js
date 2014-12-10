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

  render() {
    var label = this.groupLabel();

    if (label) {
      this.renderLabeledBox(label);

      this.regexp.setContainer(this.container.group());
      this.regexp.render();
    } else {
      this.regexp.setContainer(this.container);
      this.regexp.render();
    }
  },

  position() {
    this.regexp.position();

    if (this.groupLabel()) {
      this.positionLabeledBox(this.regexp.container, {
        padding: 10
      });
    }
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
