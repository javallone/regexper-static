import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'literal',

  render() {
    this.container.addClass('literal');

    this.label = this.renderLabel(this.container, '"' + this.literal.textValue + '"');

    this.label.select('rect').attr({
      rx: 3,
      ry: 3
    });
  }
});
