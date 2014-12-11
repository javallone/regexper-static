import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'any-character',

  _render() {
    this.label = this.renderLabel(this.container, 'any character');
  }
});
