// CharsetEscape nodes are for escape sequences inside of character sets. They
// differ from other [Escape](./escape.html) nodes in that `\b` matches a
// backspace character instead of a word boundary.

import _ from 'lodash';
import Escape from './escape.js';

export default _.extend({}, Escape, {
  type: 'charset-escape',

  b: ['backspace', 0x08, true]
});
