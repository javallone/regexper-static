import _ from 'lodash';
import Escape from './escape.js';

export default _.extend({}, Escape, {
  type: 'charset-escape',

  b: 'backspace'
});
