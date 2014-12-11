import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'match',

  _render() {
    var parts = this.parts();

    if (this.anchorStart() || this.anchorEnd() || parts.length !== 1) {
      this.contents = {};

      if (this.anchorStart()) {
        this.contents.anchor_start = this.renderLabel('Start of line')
          .addClass('anchor');
      }

      this.contents.parts = _.map(parts, (function(part) {
        part.setContainer(this.container.group());
        part.render();
        return part;
      }).bind(this));

      if (this.anchorEnd()) {
        this.contents.anchor_end = this.renderLabel('End of line')
          .addClass('anchor');
      }
    } else {
      this.proxy(parts[0]);
    }
  },

  _position() {
    var items;

    _.invoke(this.contents.parts, 'position');

    items = _(this.contents).values().flatten().value();
    this.spaceHorizontally(items, {
      padding: 10
    });
  },

  anchorStart() {
    return this._anchor_start.textValue !== '';
  },

  anchorEnd() {
    return this._anchor_end.textValue !== '';
  },

  parts() {
    return _.reduce(this._parts.elements, function(result, node) {
      var last = result.pop();

      if (last) {
        if (node.elements[0].type === 'literal' && node.elements[1].textValue === '' && last.elements[0].type === 'literal' && last.elements[1].textValue === '') {
          last = _.clone(last, true);
          last.textValue += node.textValue;
          last.elements[0].textValue += node.elements[0].textValue;
          last.elements[0].literal.textValue += node.elements[0].literal.textValue;
          last.elements[1] = node.elements[1];
          node = last;
        } else {
          result.push(last);
        }
      }

      result.push(node);
      return result;
    }, []);
  }
});
