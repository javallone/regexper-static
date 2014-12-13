import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset-range',

  _render() {
    var hyphen = this.container.text()
      .attr({
        text: '-'
      });

    return Q.all([
      this.first.render(this.container.group()),
      this.last.render(this.container.group())
    ])
      .then((() => {
        this.spaceHorizontally([this.first, hyphen, this.last], {
          padding: 5
        });
      }).bind(this));
  }
});
