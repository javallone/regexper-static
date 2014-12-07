import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'any_character',

  render() {
    this.container.addClass('any-character');

    this.label = this.render_label(this.container, 'any character');
  }
});
