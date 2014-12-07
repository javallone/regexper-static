import _ from 'lodash';
import Escape from './escape.js';

export default _.extend({}, Escape, {
  type: 'charset_escape',

  codeMap: _.extend({}, Escape.codeMap, {
    b: 'backspace'
  })
});
