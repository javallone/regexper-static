import _ from 'lodash';

export default {
  type: 'subexp',

  definedProperties: {
    _anchor: {
      get: function() {
        var anchor = this.regexp.anchor,
            matrix = this.transform().localMatrix;

        return _.extend(anchor, {
          ax: matrix.x(anchor.ax, anchor.ay),
          ax2: matrix.x(anchor.ax2, anchor.ay),
          ay: matrix.y(anchor.ax, anchor.ay)
        });
      }
    }
  },

  labelMap: {
    '?:': '',
    '?=': 'positive lookahead',
    '?!': 'negative lookahead'
  },

  _render() {
    return this.regexp.render(this.container.group())
      .then(() => {
        return this.renderLabeledBox(this.label, this.regexp, {
          padding: 10
        });
      });
  },

  setup() {
    if (_.has(this.labelMap, this.properties.capture.textValue)) {
      this.label = this.labelMap[this.properties.capture.textValue];
    } else {
      this.label = 'group #' + (this.state.groupCounter++);
    }

    this.regexp = this.properties.regexp;

    if (!this.label) {
      this.proxy = this.regexp;
    }
  }
};
