import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'root',

  _render() {
    var flags = this.flags(),
        flagLabels = [];

    if (flags.global) {
      flagLabels.push('Global');
    }
    if (flags.ignore_case) {
      flagLabels.push('Ignore Case');
    }
    if (flags.multiline) {
      flagLabels.push('Multiline');
    }

    if (flagLabels.length > 0) {
      this.flagText = this.container.text(0, 0, `Flags: ${flagLabels.join(', ')}`);
    }

    this.start = this.container.circle()
      .addClass('pin')
      .attr({ r: 5 });
    this.end = this.container.circle()
      .addClass('pin')
      .attr({ r: 5 });

    return this.regexp.render(this.container.group())
      .then(() => {
        var box,
            offset = 0;

        if (this.flagText) {
          offset = this.flagText.getBBox().height;
        }

        this.regexp.transform(Snap.matrix()
          .translate(10, offset));

        box = this.regexp.getBBox();

        this.start.transform(Snap.matrix()
          .translate(0, box.ay));
        this.end.transform(Snap.matrix()
          .translate(box.x2 + 10, box.ay));

        this.container.prepend(
          this.container.path(`M${box.ax},${box.ay}H0M${box.ax2},${box.ay}H${box.x2 + 10}`));
      });
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
