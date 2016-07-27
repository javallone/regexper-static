// Regexp nodes are the entire regular expression. They consist of a collection
// of [Match](./match.html) nodes separated by `|`.

import util from '../../util.js';
import _ from 'lodash';

export default {
  type: 'regexp',

  // Renders the regexp into the currently set container.
  _render() {
    let matchContainer = this.container.group()
      .addClass('regexp-matches')
      .transform(Snap.matrix()
        .translate(20, 0));

    // Renders each match into the match container.
    return Promise.all(_.map(this.matches,
      match => match.render(matchContainer.group())
    ))
      .then(() => {
        let containerBox,
            paths;

        // Space matches vertically in the match container.
        util.spaceVertically(this.matches, {
          padding: 5
        });

        containerBox = this.getBBox();

        // Creates the curves from the side lines for each match.
        paths = _.map(this.matches, match => this.makeCurve(containerBox, match));

        // Add side lines to the list of paths.
        paths.push(this.makeSide(containerBox, _.first(this.matches)));
        paths.push(this.makeSide(containerBox, _.last(this.matches)));

        // Render connector paths.
        this.container.prepend(
          this.container.path(_(paths).flatten().compact().values().join('')));

        containerBox = matchContainer.getBBox();

        // Create connections from side lines to each match and render into
        // the match container.
        paths = _.map(this.matches, match => this.makeConnector(containerBox, match));
        matchContainer.prepend(
          matchContainer.path(paths.join('')));
      });
  },

  // Returns an array of SVG path strings to draw the vertical lines on the
  // left and right of the node.
  //
  // - __containerBox__ - Bounding box of the container.
  // - __match__ - Match node that the line will be drawn to.
  makeSide(containerBox, match) {
    let box = match.getBBox(),
        distance = Math.abs(box.ay - containerBox.cy);

    // Only need to draw side lines if the match is more than 15 pixels from
    // the vertical center of the rendered regexp. Less that 15 pixels will be
    // handled by the curve directly.
    if (distance >= 15) {
      let shift = (box.ay > containerBox.cy) ? 10 : -10,
          edge = box.ay - shift;

      return [
        `M0,${containerBox.cy}q10,0 10,${shift}V${edge}`,
        `M${containerBox.width + 40},${containerBox.cy}q-10,0 -10,${shift}V${edge}`
      ];
    }
  },

  // Returns an array of SVG path strings to draw the curves from the
  // sidelines up to the anchor of the match node.
  //
  // - __containerBox__ - Bounding box of the container.
  // - __match__ - Match node that the line will be drawn to.
  makeCurve(containerBox, match) {
    let box = match.getBBox(),
        distance = Math.abs(box.ay - containerBox.cy);

    if (distance >= 15) {
      // For match nodes more than 15 pixels from the center of the regexp, a
      // quarter-circle curve is used to connect to the sideline.
      let curve = (box.ay > containerBox.cy) ? 10 : -10;

      return [
        `M10,${box.ay - curve}q0,${curve} 10,${curve}`,
        `M${containerBox.width + 30},${box.ay - curve}q0,${curve} -10,${curve}`
      ];
    } else {
      // For match nodes less than 15 pixels from the center of the regexp, a
      // slightly curved line is used to connect to the sideline.
      let anchor = box.ay - containerBox.cy;

      return [
        `M0,${containerBox.cy}c10,0 10,${anchor} 20,${anchor}`,
        `M${containerBox.width + 40},${containerBox.cy}c-10,0 -10,${anchor} -20,${anchor}`
      ];
    }
  },

  // Returns an array of SVG path strings to draw the connection from the
  // curve to match node.
  //
  // - __containerBox__ - Bounding box of the container.
  // - __match__ - Match node that the line will be drawn to.
  makeConnector(containerBox, match) {
    let box = match.getBBox();

    return `M0,${box.ay}h${box.ax}M${box.ax2},${box.ay}H${containerBox.width}`;
  },

  setup() {
    if (this.properties.alternates.elements.length === 0) {
      // When there is only one match node to render, proxy to it.
      this.proxy = this.properties.match;
    } else {
      // Merge all the match nodes into one array.
      this.matches = [this.properties.match].concat(
        _.map(this.properties.alternates.elements,
          element => element.properties.match)
      );
    }
  }
};
