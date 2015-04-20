// MatchFragment nodes are part of a [Match](./match.html) followed by an
// optional [Repeat](./repeat.html) node. If no repeat is applied, then
// rendering is proxied to the content node.

import _ from 'lodash';

export default {
  type: 'match-fragment',

  definedProperties: {
    // Default anchor is overridden to apply an transforms from the fragment
    // to its content's anchor. Essentially, the fragment inherits the anchor
    // of its content.
    _anchor: {
      get: function() {
        var anchor = this.content.getBBox(),
            matrix = this.transform().localMatrix;

        return {
          ax: matrix.x(anchor.ax, anchor.ay),
          ax2: matrix.x(anchor.ax2, anchor.ay),
          ay: matrix.y(anchor.ax, anchor.ay)
        };
      }
    }
  },

  // Renders the fragment into the currently set container.
  _render() {
    return this.content.render(this.container.group())
      .then(() => {
        var box, paths;

        // Contents must be transformed based on the repeat that is applied.
        this.content.transform(this.repeat.contentPosition);

        box = this.content.getBBox();

        // Add skip or repeat paths to the container.
        paths = _.flatten([
          this.skipPath(box),
          this.loopPath(box)
        ]);

        this.container.prepend(
          this.container.path(paths.join('')));

        this.loopLabel();
      });
  },

  // Returns the path spec to render the line that skips over the content for
  // fragments that are optionally matched.
  skipPath(box) {
    var paths = [];

    if (this.repeat.hasSkip) {
      let vert = Math.max(0, box.ay - box.y - 10),
          horiz = box.width - 10;

      paths.push(`M0,${box.ay}q10,0 10,-10v${-vert}q0,-10 10,-10h${horiz}q10,0 10,10v${vert}q0,10 10,10`);

      // When the repeat is not greedy, the skip path gets a preference arrow.
      if (!this.repeat.greedy) {
        paths.push(`M10,${box.ay - 15}l5,5m-5,-5l-5,5`);
      }
    }

    return paths;
  },

  // Returns the path spec to render the line that repeats the content for
  // fragments that are matched more than once.
  loopPath(box) {
    var paths = [];

    if (this.repeat.hasLoop) {
      let vert = box.y2 - box.ay - 10;

      paths.push(`M${box.x},${box.ay}q-10,0 -10,10v${vert}q0,10 10,10h${box.width}q10,0 10,-10v${-vert}q0,-10 -10,-10`);

      // When the repeat is greedy, the loop path gets the preference arrow.
      if (this.repeat.greedy) {
        paths.push(`M${box.x2 + 10},${box.ay + 15}l5,-5m-5,5l-5,-5`);
      }
    }

    return paths;
  },

  // Renders label for the loop path indicating how many times the content may
  // be matched.
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
    // Then content of the fragment.
    this.content = this.properties.content;
    // The repetition rule for the fragment.
    this.repeat = this.properties.repeat;

    if (!this.repeat.hasLoop && !this.repeat.hasSkip) {
      // For fragments without a skip or loop, rendering is proxied to the
      // content. Also set flag indicating that contents can be merged if the
      // content is a literal node.
      this.canMerge = (this.content.type === 'literal');
      this.proxy = this.content;
    } else {
      // Fragments that have skip or loop lines cannot be merged with others.
      this.canMerge = false;
    }
  }
};
