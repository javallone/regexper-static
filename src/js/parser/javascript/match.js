// Match nodes are used for the parts of a regular expression between `|`
// symbols. They consist of a series of [MatchFragment](./match_fragment.html)
// nodes. Optional `^` and `$` symbols are also allowed at the beginning and
// end of the Match.

import util from '../../util.js';
import _ from 'lodash';

export default {
  type: 'match',

  definedProperties: {
    // Default anchor is overridden to attach the left point of the anchor to
    // the first element, and the right point to the last element.
    _anchor: {
      get: function() {
        var start = util.normalizeBBox(this.start.getBBox()),
            end = util.normalizeBBox(this.end.getBBox()),
            matrix = this.transform().localMatrix;

        return {
          ax: matrix.x(start.ax, start.ay),
          ax2: matrix.x(end.ax2, end.ay),
          ay: matrix.y(start.ax, start.ay)
        };
      }
    }
  },

  // Renders the match into the currently set container.
  _render() {
    var start, end,
        partPromises,
        items;

    // A `^` at the beginning of the match leads to the "Start of line"
    // indicator being rendered.
    if (this.anchorStart) {
      start = this.renderLabel('Start of line')
        .then(label => {
          return label.addClass('anchor');
        });
    }

    // A `$` at the end of the match leads to the "End of line" indicator
    // being rendered.
    if (this.anchorEnd) {
      end = this.renderLabel('End of line')
        .then(label => {
          return label.addClass('anchor');
        });
    }

    // Render each of the match fragments.
    partPromises = _.map(this.parts, part => {
      return part.render(this.container.group());
    });

    items = _([start, partPromises, end]).flatten().compact().value();

    // Handle the situation where a regular expression of `()` is rendered.
    // This leads to a Match node with no fragments, no start indicator, and
    // no end indicator. Something must be rendered so that the anchor can be
    // calculated based on it.
    if (items.length === 0) {
      items = [this.container.group()];
    }

    return Promise.all(items)
      .then(items => {
        // Find SVG elements to be used when calculating the anchor.
        this.start = _.first(items);
        this.end = _.last(items);

        util.spaceHorizontally(items, {
          padding: 10
        });

        // Add lines between each item.
        this.container.prepend(
          this.container.path(this.connectorPaths(items).join('')));
      });
  },

  // Returns an array of SVG path strings between each item.
  // - __items__ - Array of SVG elements or nodes.
  connectorPaths(items) {
    var prev, next;

    prev = util.normalizeBBox(_.first(items).getBBox());
    return _.map(items.slice(1), item => {
      try {
        next = util.normalizeBBox(item.getBBox());
        return `M${prev.ax2},${prev.ay}H${next.ax}`;
      }
      finally {
        prev = next;
      }
    });
  },

  setup() {
    // Merged list of MatchFragments to be rendered.
    this.parts = _.reduce(this.properties.parts.elements, function(result, node) {
      var last = _.last(result);

      if (last && node.canMerge && last.canMerge) {
        // Merged the content of `node` into `last` when possible. This also
        // discards `node` in the process since `result` has not been changed.
        last.content.merge(node.content);
      } else {
        // `node` cannot be merged with the previous node, so it is added to
        // the list of parts.
        result.push(node);
      }

      return result;
    }, []);

    // Indicates if the expression starts with a `^`.
    this.anchorStart = (this.properties.anchor_start.textValue !== '');
    // Indicates if the expression ends with a `$`.
    this.anchorEnd = (this.properties.anchor_end.textValue !== '');

    // When there are no anchors and only one part, then proxy to the part.
    if (!this.anchorStart && !this.anchorEnd && this.parts.length === 1) {
      this.proxy = this.parts[0];
    }
  }
};
