import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
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
      .then(this.spaceHorizontally.bind(this, contents, {
        padding: 5
      }));
  }
});
