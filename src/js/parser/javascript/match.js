import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'match',

  _render() {
    var start, end,
        parts = this.parts(),
        partPromises;

    if (this.anchorStart()) {
      start = this.renderLabel('Start of line')
        .invoke('addClass', 'anchor');
    }

    if (this.anchorEnd()) {
      end = this.renderLabel('End of line')
        .invoke('addClass', 'anchor');
    }

    if (start || end || parts.length !== 1) {
      partPromises = _.map(parts, (function(part) {
        return part.render(this.container.group());
      }).bind(this));

      return Q.all(_([start, partPromises, end]).flatten().compact().value())
        .then(((items) => {
          var prev, next, paths;

          this.items = items;
          this.spaceHorizontally(items, {
            padding: 10
          });

          prev = this.normalizeBBox(_.first(items).getBBox());
          paths = _.map(items.slice(1), (item => {
            var path;

            next = this.normalizeBBox(item.getBBox());
            path = Snap.format('M{prev.ax2},{prev.ay}H{next.ax}', {
              prev,
              next
            });
            prev = next;

            return path;
          }).bind(this));

          this.container.prepend(
            this.container.path(paths.join('')));
        }).bind(this));
    } else {
      return this.proxy(parts[0]);
    }
  },

  anchorStart() {
    return this._anchor_start.textValue !== '';
  },

  anchorEnd() {
    return this._anchor_end.textValue !== '';
  },

  parts() {
    return _.reduce(this._parts.elements, function(result, node) {
      var last = _.last(result);

      if (last && node.elements[0].type === 'literal' && node.elements[1].textValue === '' && last.elements[0].type === 'literal' && last.elements[1].textValue === '') {
        last.textValue += node.textValue;
        last.elements[0].textValue += node.elements[0].textValue;
        last.elements[0].literal.textValue += node.elements[0].literal.textValue;
      } else {
        result.push(node);
      }

      return result;
    }, []);
  },

  _getAnchor() {
    var start = this.normalizeBBox(_.first(this.items).getBBox()),
        end = this.normalizeBBox(_.last(this.items).getBBox()),
        matrix = this.transform().localMatrix;

    return {
      atype: [start.atype, end.atype].join('/'),
      ax: matrix.x(start.ax, start.ay),
      ax2: matrix.x(end.ax2, end.ay),
      ay: matrix.y(start.ax, start.ay)
    };
  }
});
