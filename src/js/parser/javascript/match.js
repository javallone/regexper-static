import util from '../../util.js';
import _ from 'lodash';
import Q from 'q';

export default {
  type: 'match',

  definedProperties: {
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

  _render() {
    var start, end,
        partPromises,
        items;

    if (this.anchorStart) {
      start = this.renderLabel('Start of line')
        .invoke('addClass', 'anchor');
    }

    if (this.anchorEnd) {
      end = this.renderLabel('End of line')
        .invoke('addClass', 'anchor');
    }

    partPromises = _.map(this.parts, part => {
      return part.render(this.container.group());
    });

    items = _([start, partPromises, end]).flatten().compact().value();

    if (items.length === 0) {
      items = [this.container.group()];
    }

    return Q.all(items)
      .then(items => {
        this.start = _.first(items);
        this.end = _.last(items);

        util.spaceHorizontally(items, {
          padding: 10
        });

        this.container.prepend(
          this.container.path(this.connectorPaths(items).join('')));
      });
  },

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
    this.parts = _.reduce(this.properties.parts.elements, function(result, node) {
      var last = _.last(result);

      if (last && node.canMerge && last.canMerge) {
        last.content.merge(node.content);
      } else {
        result.push(node);
      }

      return result;
    }, []);

    this.anchorStart = (this.properties.anchor_start.textValue !== '');
    this.anchorEnd = (this.properties.anchor_end.textValue !== '');

    if (!this.anchorStart && !this.anchorEnd && this.parts.length === 1) {
      this.proxy = this.parts[0];
    }
  }
};
