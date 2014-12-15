import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'match-fragment',

  _render() {
    if (this._repeat.textValue === '') {
      return this.proxy(this._content);
    } else {
      return this._content.render(this.container.group())
        .then((() => {
          var box, paths = [];

          this._content.transform(this._repeat.contentPosition());

          box = this._content.getBBox();

          if (this._repeat.hasSkip()) {
            paths.push(Snap.format('M0,{box.ay}q10,0 10,-10v-{vert}q0,-10 10,-10h{horiz}q10,0 10,10v{vert}q0,10 10,10', {
              box,
              vert: Math.max(0, box.ay - box.y - 10),
              horiz: box.width - 10
            }));
          }

          if (this._repeat.hasLoop()) {
            paths.push(Snap.format('M{box.x},{box.ay}q-10,0 -10,10v{vert}q0,10 10,10h{box.width}q10,0 10,-10v-{vert}q0,-10 -10,-10', {
              box,
              vert: box.y2 - box.ay - 10
            }));
          }

          if (paths.length) {
            this.container.prepend(
              this.container.path(paths.join('')));
          }
        }).bind(this));
    }
  },

  _getAnchor() {
    var anchor = this._content.getAnchor(),
        matrix = this.transform().localMatrix;

    return _.extend(anchor, {
      ax: matrix.x(anchor.ax, anchor.ay),
      ax2: matrix.x(anchor.ax2, anchor.ay),
      ay: matrix.y(anchor.ax, anchor.ay)
    });
  }
});
