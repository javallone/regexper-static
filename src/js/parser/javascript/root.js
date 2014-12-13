import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'root',

  _render() {
    var promise = this.regexp.render(this.container.group());
    this.regexp.transform(Snap.matrix()
      .translate(10, 0));

    this.start = this.container.circle()
      .addClass('pin')
      .attr({ r: 5 });
    this.end = this.container.circle()
      .addClass('pin')
      .attr({ r: 5 });

    return promise;
  },

  _position() {
    var contentBox = this.regexp.getBBox();

    this.start.transform(Snap.matrix()
      .translate(0, contentBox.cy));
    this.end.transform(Snap.matrix()
      .translate(contentBox.x2 + 10, contentBox.cy));
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
