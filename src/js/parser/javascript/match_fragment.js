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
        let box, paths;

        // Contents must be transformed based on the repeat that is applied.
        this.content.transform(this.repeat.contentPosition);

        box = this.content.getBBox();

        // Add skip or repeat paths to the container.
        paths = _.flatten([
          this.repeat.skipPath(box),
          this.repeat.loopPath(box)
        ]);

        this.container.prepend(
          this.container.path(paths.join('')));

        this.loopLabel();
      });
  },

  // Renders label for the loop path indicating how many times the content may
  // be matched.
  loopLabel() {
    let labelStr = this.repeat.label,
        tooltipStr = this.repeat.tooltip;

    if (labelStr) {
      let label = this.container.text(0, 0, [labelStr])
            .addClass('repeat-label'),
          labelBox = label.getBBox(),
          box = this.getBBox();

      if (tooltipStr) {
        let tooltip = this.container.el('title')
          .append(this.container.text(0, 0, tooltipStr));
        label.append(tooltip);
      }

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
