import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'literal',

  _render() {
    return this.renderLabel(['"', this.literal.textValue, '"'])
      .then(label => {
        var spans = label.selectAll('tspan');

        spans[0].addClass('quote');
        spans[2].addClass('quote');

        label.select('rect').attr({
          rx: 3,
          ry: 3
        });
      });
  }
});
