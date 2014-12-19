import { spaceHorizontally } from '../../util.js';
import _ from 'lodash';
import Q from 'q';

export default {
  type: 'charset-range',

  _render() {
    var contents = [
      this.first,
      this.container.text()
        .attr({ text: '-' }),
      this.last
    ];

    return Q.all([
      this.first.render(this.container.group()),
      this.last.render(this.container.group())
    ])
      .then(spaceHorizontally.bind(this, contents, {
        padding: 5
      }));
  },

  setup() {
    this.first = this.properties.first;
    this.last = this.properties.last;
  }
};
