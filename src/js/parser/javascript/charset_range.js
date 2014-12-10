import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset-range',

  render() {
    this.first.setContainer(this.container.group());
    this.first.render();

    this.last.setContainer(this.container.group());
    this.last.render();

    this.hyphen = this.container.text()
      .attr({
        text: '-'
      });
  },

  position() {
    var box;

    this.first.position();
    this.last.position();

    this.spaceHorizontally([this.first, this.hyphen, this.last], {
      padding: 5
    });
  }
});
