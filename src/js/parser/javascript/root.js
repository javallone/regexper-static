import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'root',

  render() {
    this.regexp.setContainer(this.container.group().transform(Snap.matrix()
      .translate(10, 0)));
    this.regexp.render();

    this.start = this.container.circle()
      .addClass('pin')
      .attr({ r: 5 });
    this.end = this.container.circle()
      .addClass('pin')
      .attr({ r: 5 });
  },

  position() {
    var contentBox;

    this.regexp.position();

    contentBox = this.regexp.getBBox();

    this.container.prepend(
      this.container.path(Snap.format('M0,{cy}h10M{x2},{cy}h10', contentBox))
    );

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
