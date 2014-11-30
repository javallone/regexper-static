import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  render(container) {
    this.contents = container.group();

    this.regexp.render(this.contents);

    this.start = container.circle().attr({
      r: 5,
      'class': 'anchor'
    });
    this.end = container.circle().attr({
      r: 5,
      'class': 'anchor'
    });
  },

  position() {
    var contentBox;

    this.regexp.position();

    contentBox = this.contents.getBBox();

    this.start.transform(Snap.matrix()
      .translate(contentBox.x, contentBox.cy));
    this.end.transform(Snap.matrix()
      .translate(contentBox.x2, contentBox.cy));
  },

  flags() {
    var flags;

    if (this.fl) {
      flags = this.fl.textValue;
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
