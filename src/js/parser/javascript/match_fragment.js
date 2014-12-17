import _ from 'lodash';

export default {
  type: 'match-fragment',

  _render() {
    if (this._repeat.textValue === '') {
      return this.proxy(this._content);
    } else {
      return this._content.render(this.container.group())
        .then(() => {
          var box, paths = [];

          this._content.transform(this._repeat.contentPosition());

          box = this._content.getBBox();

          if (this._repeat.hasSkip()) {
            let vert = Math.max(0, box.ay - box.y - 10),
                horiz = box.width - 10;

            paths.push(`M0,${box.ay}q10,0 10,-10v${-vert}q0,-10 10,-10h${horiz}q10,0 10,10v${vert}q0,10 10,10`);

            if (!this._repeat.greedy()) {
              paths.push(`M10,${box.ay - 15}l5,5m-5,-5l-5,5`);
            }
          }

          if (this._repeat.hasLoop()) {
            let vert = box.y2 - box.ay - 10;

            paths.push(`M${box.x},${box.ay}q-10,0 -10,10v${vert}q0,10 10,10h${box.width}q10,0 10,-10v${-vert}q0,-10 -10,-10`);

            if (this._repeat.greedy()) {
              paths.push(`M${box.x2 + 10},${box.ay + 15}l5,-5m-5,5l-5,-5`);
            }
          }

          if (paths.length) {
            this.container.prepend(
              this.container.path(paths.join('')));
          }
        })
        .then(() => {
          var labelStr = this._repeat.label(),
              label,
              labelBox,
              labelShift = (this._repeat.hasSkip() ? 5 : 0),
              box = this.getBBox();

          if (labelStr) {
            label = this.container.text(0, 0, labelStr)
              .addClass('repeat-label');
            labelBox = label.getBBox();
            label.transform(Snap.matrix()
              .translate(box.x2 - labelBox.width - labelShift, box.y2 + labelBox.height));
          }
        });
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
};
