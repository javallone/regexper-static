import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'match',

  render() {
    var self = this;

    this.contents = {};

    if (this.anchorStart()) {
      this.contents.anchor_start = this.renderLabel(this.container, 'Start of line')
        .addClass('anchor');
    }

    this.contents.parts = _.map(this.parts(), function(part) {
      part.setContainer(self.container.group());
      part.render();
      return part;
    });

    if (this.anchorEnd()) {
      this.contents.anchor_end = this.renderLabel(this.container, 'End of line')
        .addClass('anchor');
    }
  },

  position() {
    var items, paths;

    if (this.anchorStart()) {
      this.positionLabel(this.contents.anchor_start);
    }

    if (this.anchorEnd()) {
      this.positionLabel(this.contents.anchor_end);
    }

    _.invoke(this.contents.parts, 'position');

    items = _(this.contents).values().flatten().value();
    this.spaceHorizontally(items, {
      padding: 10
    });

    // NOTE:
    // item.cy won't work for this in the long run once vertical centers can be
    // offset.
    paths = _.map(items, item => {
      return Snap.format('M{item.x2},{item.cy}h10', {
        item: item.getBBox()
      });
    });
    paths.pop();

    this.container.prepend(this.container.path(paths.join('')));
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
