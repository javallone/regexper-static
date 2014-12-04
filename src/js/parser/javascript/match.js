import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'match',

  render() {
    var self = this;

    this.contents = {};

    if (this.anchor_start()) {
      this.contents.anchor_start = this.render_label(this.container, 'Start of line')
        .addClass('anchor');
    }

    this.contents.parts = _.map(this.parts(), function(part) {
      part.container = self.container.group();
      part.render();
      return part;
    });

    if (this.anchor_end()) {
      this.contents.anchor_end = this.render_label(this.container, 'End of line')
        .addClass('anchor');
    }
  },

  position() {
    var offset = 0;

    if (this.anchor_start()) {
      this.position_label(this.contents.anchor_start);
      offset += this.contents.anchor_start.getBBox().width;
    }

    _.each(this.contents.parts, function(part) {
      part.position();
      part.container.transform(Snap.matrix()
        .translate(offset, 0));
      offset += part.container.getBBox().width;
    });

    if (this.anchor_end()) {
      this.position_label(this.contents.anchor_end);
      this.contents.anchor_end.transform(Snap.matrix()
        .translate(offset, 0));
    }
  },

  anchor_start() {
    return this._anchor_start.textValue !== '';
  },

  anchor_end() {
    return this._anchor_end.textValue !== '';
  },

  parts() {
    return _.reduce(this._parts.elements, function(result, node) {
      var last = result.pop();

      if (last) {
        if (node.elements[0].type === 'terminal' && last.elements[0].type === 'terminal' && last.elements[1].textValue === '') {
          last = _.clone(last, true);
          last.textValue += node.textValue;
          last.elements[0].textValue += node.elements[0].textValue;
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
