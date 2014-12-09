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
      part.container = self.container.group();
      part.render();
      return part;
    });

    if (this.anchorEnd()) {
      this.contents.anchor_end = this.renderLabel(this.container, 'End of line')
        .addClass('anchor');
    }
  },

  position() {
    var offset = 0,
        path = [];

    if (this.anchorStart()) {
      this.positionLabel(this.contents.anchor_start);
      offset += this.contents.anchor_start.getBBox().width + 10;
      path.push(Snap.format('M{x2},{cy}h10', this.contents.anchor_start.getBBox()));
    }

    _.each(this.contents.parts, function(part) {
      part.position();
      part.container.transform(Snap.matrix()
        .translate(offset, 0));
      offset += part.container.getBBox().width + 10;
      path.push(Snap.format('M{x2},{cy}h10', part.container.getBBox()));
    });

    if (this.anchorEnd()) {
      this.positionLabel(this.contents.anchor_end);
      this.contents.anchor_end.transform(Snap.matrix()
        .translate(offset, 0));
    } else {
      path.pop();
    }

    this.container.prepend(
      this.container.path(path.join(''))
    );
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
