import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'match',

  _render() {
    this.contents = { parts: this.parts() };

    if (this.anchorStart()) {
      this.contents.anchor_start = this.renderLabel('Start of line')
        .addClass('anchor');
    }

    if (this.anchorEnd()) {
      this.contents.anchor_end = this.renderLabel('End of line')
        .addClass('anchor');
    }

    if (this.contents.anchor_start || this.contents.anchor_end || this.contents.parts.length !== 1) {
      return Q.all(_.map(this.contents.parts, (function(part) {
        return part.render(this.container.group());
      }).bind(this)));
    } else {
      return this.proxy(this.contents.parts[0]);
    }
  },

  _position() {
    var items = _(this.contents).at('anchor_start', 'parts', 'anchor_end').flatten().compact().value();

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
      var last = _.last(result);

      if (last && node.elements[0].type === 'literal' && node.elements[1].textValue === '' && last.elements[0].type === 'literal' && last.elements[1].textValue === '') {
        last.textValue += node.textValue;
        last.elements[0].textValue += node.elements[0].textValue;
        last.elements[0].literal.textValue += node.elements[0].literal.textValue;
      } else {
        result.push(node);
      }

      return result;
    }, []);
  }
});
