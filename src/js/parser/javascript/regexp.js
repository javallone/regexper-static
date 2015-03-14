import util from '../../util.js';
import _ from 'lodash';

export default {
  type: 'regexp',

  _render() {
    var matchContainer = this.container.group()
      .addClass('regexp-matches')
      .transform(Snap.matrix()
        .translate(20, 0));

    return Promise.all(_.map(this.matches, match => {
      return match.render(matchContainer.group());
    }))
      .then(() => {
        var containerBox,
            paths;

        util.spaceVertically(this.matches, {
          padding: 5
        });

        containerBox = this.getBBox();
        paths = _.map(this.matches, match => {
          return this.makeCurve(containerBox, match)
        });

        paths.push(this.makeSide(containerBox, _.first(this.matches)));
        paths.push(this.makeSide(containerBox, _.last(this.matches)));

        this.container.prepend(
          this.container.path(_(paths).flatten().compact().values().join('')));

        containerBox = matchContainer.getBBox();
        paths = _.map(this.matches, match => {
          return this.makeConnector(containerBox, match);
        });
        matchContainer.prepend(
          matchContainer.path(paths.join('')));
      });
  },

  makeSide(containerBox, match) {
    var box = match.getBBox(),
        distance = Math.abs(box.ay - containerBox.cy);

    if (distance >= 15) {
      let shift = (box.ay > containerBox.cy) ? 10 : -10,
          edge = box.ay - shift;

      return [
        `M0,${containerBox.cy}q10,0 10,${shift}V${edge}`,
        `M${containerBox.width + 40},${containerBox.cy}q-10,0 -10,${shift}V${edge}`
      ];
    }
  },

  makeCurve(containerBox, match) {
    var box = match.getBBox(),
        distance = Math.abs(box.ay - containerBox.cy);

    if (distance >= 15) {
      let curve = (box.ay > containerBox.cy) ? 10 : -10;

      return [
        `M10,${box.ay - curve}q0,${curve} 10,${curve}`,
        `M${containerBox.width + 30},${box.ay - curve}q0,${curve} -10,${curve}`
      ];
    } else {
      let anchor = box.ay - containerBox.cy;

      return [
        `M0,${containerBox.cy}c10,0 10,${anchor} 20,${anchor}`,
        `M${containerBox.width + 40},${containerBox.cy}c-10,0 -10,${anchor} -20,${anchor}`
      ];
    }
  },

  makeConnector(containerBox, match) {
    var box = match.getBBox();

    return `M0,${box.ay}h${box.ax}M${box.ax2},${box.ay}H${containerBox.width}`;
  },

  setup() {
    if (this.properties.alternates.elements.length === 0) {
      this.proxy = this.properties.match;
    } else {
      this.matches = [this.properties.match]
        .concat(_.map(this.properties.alternates.elements, element => {
          return element.properties.match;
        }));
    }
  }
};
