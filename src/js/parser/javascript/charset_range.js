import util from '../../util.js';
import _ from 'lodash';

export default {
  type: 'charset-range',

  _render() {
    var contents = [
      this.first,
      this.container.text(0, 0, '-'),
      this.last
    ];

    return Promise.all([
      this.first.render(this.container.group()),
      this.last.render(this.container.group())
    ])
      .then(() => {
        util.spaceHorizontally(contents, {
          padding: 5
        });
      });
  },

  setup() {
    this.first = this.properties.first;
    this.last = this.properties.last;

    if (this.first.ordinal > this.last.ordinal) {
      throw `Range out of order in character class: ${this.textValue}`;
    }
  }
};
