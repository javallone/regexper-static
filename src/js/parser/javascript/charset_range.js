import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset-range',

  _render() {
    this.hyphen = this.container.text()
      .attr({
        text: '-'
      });

    return Q.all([
      this.first.render(this.container.group()),
      this.last.render(this.container.group())
    ]);
  },

  _position() {
    this.spaceHorizontally([this.first, this.hyphen, this.last], {
      padding: 5
    });
  }
});
