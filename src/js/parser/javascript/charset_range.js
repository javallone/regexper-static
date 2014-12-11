import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset-range',

  _render() {
    this.first.render(this.container.group());
    this.last.render(this.container.group());

    this.hyphen = this.container.text()
      .attr({
        text: '-'
      });
  },

  _position() {
    this.first.position();
    this.last.position();

    this.spaceHorizontally([this.first, this.hyphen, this.last], {
      padding: 5
    });
  }
});
