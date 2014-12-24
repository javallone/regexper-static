import _ from 'lodash';

export default {
  type: 'match-fragment',

  definedProperties: {
    _anchor: {
      get: function() {
        var anchor = this.content.anchor,
            matrix = this.transform().localMatrix;

        return _.extend(anchor, {
          ax: matrix.x(anchor.ax, anchor.ay),
          ax2: matrix.x(anchor.ax2, anchor.ay),
          ay: matrix.y(anchor.ax, anchor.ay)
        });
      }
    }
  },

  _render() {
    return this.content.render(this.container.group())
      .then(() => {
        var box, paths;

        this.content.transform(this.repeat.contentPosition);

        box = this.content.getBBox();

        paths = _.flatten([
          this.skipPath(box),
          this.loopPath(box)
        ]);

        this.container.prepend(
          this.container.path(paths.join('')));
      })
      .then(() => {
        this.loopLabel();
      });
  },

  skipPath(box) {
    var paths = [];

    if (this.repeat.hasSkip) {
      let vert = Math.max(0, box.ay - box.y - 10),
          horiz = box.width - 10;

      paths.push(`M0,${box.ay}q10,0 10,-10v${-vert}q0,-10 10,-10h${horiz}q10,0 10,10v${vert}q0,10 10,10`);

      if (!this.repeat.greedy) {
        paths.push(`M10,${box.ay - 15}l5,5m-5,-5l-5,5`);
      }
    }

    return paths;
  },

  loopPath(box) {
    var paths = [];

    if (this.repeat.hasLoop) {
      let vert = box.y2 - box.ay - 10;

      paths.push(`M${box.x},${box.ay}q-10,0 -10,10v${vert}q0,10 10,10h${box.width}q10,0 10,-10v${-vert}q0,-10 -10,-10`);

      if (this.repeat.greedy) {
        paths.push(`M${box.x2 + 10},${box.ay + 15}l5,-5m-5,5l-5,-5`);
      }
    }

    return paths;
  },

  loopLabel() {
    var labelStr = this.repeat.label,
        label, labelBox, box;

    if (labelStr) {
      label = this.container.text(0, 0, labelStr)
        .addClass('repeat-label');

      box = this.getBBox();
      labelBox = label.getBBox();
      label.transform(Snap.matrix().translate(
        box.x2 - labelBox.width - (this.repeat.hasSkip ? 5 : 0),
        box.y2 + labelBox.height));
    }
  },

  setup() {
    this.content = this.properties.content;
    this.repeat = this.properties.repeat;

    if (!this.repeat.hasLoop && !this.repeat.hasSkip) {
      this.canMerge = (this.content.type === 'literal');
      this.proxy = this.content;
    } else {
      this.canMerge = false;
    }
  }
};
