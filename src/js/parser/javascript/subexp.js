import _ from 'lodash';

var groupCounter = 1;

export default {
  type: 'subexp',

  labelMap: {
    '?:': '',
    '?=': 'positive lookahead',
    '?!': 'negative lookahead'
  },

  _render() {
    var label = this.groupLabel();

    if (label) {
      return this.regexp.render(this.container.group())
        .then(this.renderLabeledBox.bind(this, label, this.regexp, {
          padding: 10
        }));
    } else {
      return this.proxy(this.regexp);
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

  _getAnchor() {
    var anchor = this.regexp.getAnchor(),
        matrix = this.transform().localMatrix;

    return _.extend(anchor, {
      ax: matrix.x(anchor.ax, anchor.ay),
      ax2: matrix.x(anchor.ax2, anchor.ay),
      ay: matrix.y(anchor.ax, anchor.ay)
    });
  }
};
