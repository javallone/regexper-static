// CharsetRange nodes are used for `[a-z]` regular expression syntax. The two
// literal or escape nodes are rendered with a hyphen between them.

import util from '../../util.js';
import _ from 'lodash';

export default {
  type: 'charset-range',

  // Renders the charset range into the currently set container
  _render() {
    let contents = [
      this.first,
      this.container.text(0, 0, '-'),
      this.last
    ];

    // Render the nodes of the range.
    return Promise.all([
      this.first.render(this.container.group()),
      this.last.render(this.container.group())
    ])
      .then(() => {
        // Space the nodes and hyphen horizontally.
        util.spaceHorizontally(contents, {
          padding: 5
        });
      });
  },

  setup() {
    // The two nodes for the range. In `[a-z]` these would be
    // [Literal](./literal.html) nodes for "a" and "z".
    this.first = this.properties.first;
    this.last = this.properties.last;

    // Report invalid expression when extents of the range are out of order.
    if (this.first.ordinal > this.last.ordinal) {
      throw `Range out of order in character class: ${this.textValue}`;
    }
  }
};
