import _ from 'lodash';

export default {
  type: 'root',

  flagLabels: {
    i: 'Ignore Case',
    g: 'Global',
    m: 'Multiline'
  },

  _render() {
    var flagText;

    if (this.flags.length > 0) {
      flagText = this.container.text(0, 0, `Flags: ${this.flags.join(', ')}`);
    }

    return this.regexp.render(this.container.group())
      .then(() => {
        var box;

        if (flagText) {
          this.regexp.transform(Snap.matrix()
            .translate(10, flagText.getBBox().height));
        } else {
          this.regexp.transform(Snap.matrix()
            .translate(10, 0));
        }

        box = this.regexp.getBBox();

        this.container.path(`M${box.ax},${box.ay}H0M${box.ax2},${box.ay}H${box.x2 + 10}`);
        this.container.circle(0, box.ay, 5);
        this.container.circle(box.x2 + 10, box.ay, 5);
      });
  },

  setup() {
    this.flags = _(this.properties.flags.textValue).unique().sort().map(flag => {
      return this.flagLabels[flag];
    }).value();

    this.regexp = this.properties.regexp
  }
};
