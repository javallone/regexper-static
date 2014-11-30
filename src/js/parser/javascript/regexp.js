import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  matches() {
    if (this.elements[1].regexp) {
      return [this.match].concat(this.elements[1].regexp.matches());
    } else {
      return [this.match];
    }
  }
});
