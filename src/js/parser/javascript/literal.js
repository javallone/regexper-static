import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'literal',

  _render() {
    this.renderLabel('"' + this.literal.textValue + '"')
      .select('rect').attr({
        rx: 3,
        ry: 3
      });

    return this.terminalRender();
  }
});
