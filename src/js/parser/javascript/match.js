import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'match',

  render(container) {
    console.log('anchor_start:', this.anchor_start());
    console.log('anchor_end:', this.anchor_end());
    console.log('parts:', this.parts());

    this.contents = {};

    if (this.anchor_start()) {
      this.contents.anchor_start = this.render_label(container, 'Start of line');
    }

    this.contents.parts = _.map(this.parts(), function(part) {
      var content = container.group();
      part.elements[0].render(content);
      return { content, part };
    });

    if (this.anchor_end()) {
      this.contents.anchor_end = this.render_label(container, 'End of line');
    }
  },

  position() {
    var offset = 0;

    if (this.anchor_start()) {
      this.position_label(this.contents.anchor_start);
      offset += this.contents.anchor_start.getBBox().width;
    }

    _.each(this.contents.parts, function(thing) {
      thing.part.elements[0].position();
      thing.content.transform(Snap.matrix()
        .translate(offset, 0));
      offset += thing.content.getBBox().width;
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
          last.textValue += node.textValue;
          last.elements[0].textValue += node.elements[0].textValue;
          last.elements[1] = node.elements[1];
          node = last;
        } else {
          result.push(last);
        }
      }

      result.push(_.clone(node, true));
      return result;
    }, []);
  }
});
