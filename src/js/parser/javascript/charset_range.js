import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset_range',

  render() {
    this.first.container = this.container.group();
    this.first.render();

    this.last.container = this.container.group();
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

    box = this.first.container.getBBox();
    this.hyphen.transform(Snap.matrix()
      .translate(box.x2 + 5, box.cy - this.hyphen.getBBox().cy));

    box = this.hyphen.getBBox();
    this.last.container.transform(Snap.matrix()
      .translate(box.x2 + 5, 0));
  }
});
