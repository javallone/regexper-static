import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'root',

  _render() {
    this.start = this.container.circle()
      .addClass('pin')
      .attr({ r: 5 });
    this.end = this.container.circle()
      .addClass('pin')
      .attr({ r: 5 });

    return this.regexp.render(this.container.group())
      .then((() => {
        var contentBox;

        this.regexp.transform(Snap.matrix()
          .translate(10, 0));

        contentBox = this.regexp.getBBox();

        this.start.transform(Snap.matrix()
          .translate(0, contentBox.ay));
        this.end.transform(Snap.matrix()
          .translate(contentBox.x2 + 10, contentBox.ay));

        this.container.prepend(
          this.container.path(Snap.format('M{box.ax},{box.ay}H0M{box.ax2},{box.ay}H{box.x2}h10', {
            box: contentBox
          })));
      }).bind(this));
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
