import _ from 'lodash';
import Literal from './literal.js';

export default _.extend({}, Literal, {
  type: 'literal'
});
