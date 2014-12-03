import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  render(container) {
    this.container = container;
    this.contents = _.map(this.matches(), match => {
      var content = container.group();
      match.render(content);
      return content;
    });
  },

  position() {
    var center,
        positions,
        container = this.container,
        totalHeight,
        verticalCenter;

    _.invoke(this.matches(), 'position');

    positions = _.chain(this.contents)
      .map(content => {
        return { box: content.getBBox(), content };
      });
    center = positions.reduce((center, pos) => {
      return Math.max(center, pos.box.cx);
    }, 0).value();

    totalHeight = positions.reduce((offset, pos) => {
      pos.content.transform(Snap.matrix()
        .translate(center - pos.box.cx + 20, offset));

      return offset + pos.box.height + 5;
    }, 0).value() - 5;

    verticalCenter = totalHeight / 2

    positions.each(pos => {
      var box = pos.content.getBBox(),
          direction = box.cy > verticalCenter ? 1 : -1,
          pathStr,
          path;

      pathStr = (verticalCenter === box.cy) ?
        'M0,{center}H{side}' :
        'M0,{center}q10,0 10,{d}V{target}q0,{d} 10,{d}H{side}';

      path = container.path(Snap.format(pathStr, {
        center: verticalCenter,
        target: box.cy - 10 * direction,
        side: box.x,
        d: 10 * direction
      }));

      path.clone().transform(Snap.matrix()
        .scale(-1, 1, center + 20, 0));
    });
  },

  matches() {
    return [this._match].concat(_.map(this._alternates.elements, _.property('match')));
  }
});
