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
    return this.regexp.render(this.container.group())
      .then(this.renderLabeledBox.bind(this, this.label, this.regexp, {
        padding: 10
      }));
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
  },

  setup() {
    if (_.has(this.labelMap, this.properties.capture.textValue)) {
      this.label = this.labelMap[this.properties.capture.textValue];
    } else {
      this.label = 'group #' + (groupCounter++);
    }

    this.regexp = this.properties.regexp;

    if (!this.label) {
      this.proxy = this.regexp;
    }
  }
};
