import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'root',

  render() {
    this.regexp.container = this.container.group();
    this.regexp.render();

    this.start = this.container.circle().attr({
      r: 5,
      'class': 'pin'
    });
    this.end = this.container.circle().attr({
      r: 5,
      'class': 'pin'
    });
  },

  position() {
    var contentBox;

    this.regexp.position();

    contentBox = this.regexp.container.getBBox();

    this.start.transform(Snap.matrix()
      .translate(contentBox.x, contentBox.cy));
    this.end.transform(Snap.matrix()
      .translate(contentBox.x2, contentBox.cy));
  },

  flags() {
    var flags;

    if (this._flags) {
      flags = this._flags.textValue;
    } else {
      flags = '';
    }

    return {
      global: /g/.test(flags),
      ignore_case: /i/.test(flags),
      multiline: /m/.test(flags)
    };
  }
});
