import _ from 'lodash';

export default {
  type: 'subexp',

  definedProperties: {
    _anchor: {
      get: function() {
        var anchor = this.regexp.getBBox(),
            matrix = this.transform().localMatrix;

        return {
          ax: matrix.x(anchor.ax, anchor.ay),
          ax2: matrix.x(anchor.ax2, anchor.ay),
          ay: matrix.y(anchor.ax, anchor.ay)
        };
      }
    }
  },

  labelMap: {
    '?:': '',
    '?=': 'positive lookahead',
    '?!': 'negative lookahead'
  },

  _render() {
    // NOTE: this.label() MUST be called here, in _render and before any child
    // nodes are rendered. This is to keep the group numbers in the correct
    // order.
    var label = this.label();

    return this.regexp.render(this.container.group())
      .then(() => {
        return this.renderLabeledBox(label, this.regexp, {
          padding: 10
        });
      });
  },

  label() {
    if (typeof this._label === 'undefined') {
      if (_.has(this.labelMap, this.properties.capture.textValue)) {
        this._label = this.labelMap[this.properties.capture.textValue];
      } else {
        this._label = 'group #' + (this.state.groupCounter++);
      }
    }

    return this._label;
  },

  setup() {
    // NOTE: DO NOT call this.label() in setup. It will lead to groups being
    // numbered in reverse order
    this.regexp = this.properties.regexp;

    if (this.properties.capture.textValue == '?:') {
      this.proxy = this.regexp;
    }
  }
};
