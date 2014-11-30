import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  render(container) {
    this.contents = _.map(this.matches(), match => {
      var content = container.group();
      match.render(content);
      return content;
    });
  },

  position() {
    var center,
        positions;

    _.invoke(this.matches(), 'position');

    positions = _.chain(this.contents)
      .map(content => {
        return { box: content.getBBox(), content };
      });
    center = positions.reduce((center, pos) => {
      return Math.max(center, pos.box.cx);
    }, 0).value();

    positions.reduce((offset, pos) => {
      pos.content.transform(Snap.matrix()
        .translate(center - pos.box.cx, offset));

      return offset + pos.box.height + 5;
    }, 0);
  },

  matches() {
    return [this.match].concat(_.map(this.alternates.elements, _.property('match')));
  }
});
