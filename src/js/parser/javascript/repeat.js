// Repeat nodes are for the various repetition syntaxes (`a*`, `a+`, `a?`, and
// `a{1,3}`). It is not rendered directly, but contains data used for the
// rendering of [MatchFragment](./match_fragment.html) nodes.

function formatTimes(times) {
  if (times === 1) {
    return 'once';
  } else {
    return `${times} times`;
  }
}

export default {
  definedProperties: {
    // Translation to apply to content to be repeated to account for the loop
    // and skip lines.
    contentPosition: {
      get: function() {
        var matrix = Snap.matrix();

        if (this.hasSkip) {
          return matrix.translate(15, 10);
        } else if (this.hasLoop) {
          return matrix.translate(10, 0);
        } else {
          return matrix.translate(0, 0);
        }
      }
    },

    // Label to place of loop path to indicate the number of times that path
    // may be followed.
    label: {
      get: function() {
        if (this.minimum === this.maximum) {
          if (this.minimum === 0) {
            return undefined;
          }
          return formatTimes(this.minimum - 1);
        } else if (this.minimum <= 1 && this.maximum >= 2) {
          return `at most ${formatTimes(this.maximum - 1)}`;
        } else if (this.minimum >= 2) {
          if (this.maximum === -1) {
            return `${this.minimum - 1}+ times`;
          } else {
            return `${this.minimum - 1}\u2026${formatTimes(this.maximum - 1)}`;
          }
        }
      }
    }
  },

  // Returns the path spec to render the line that skips over the content for
  // fragments that are optionally matched.
  skipPath(box) {
    var paths = [];

    if (this.hasSkip) {
      let vert = Math.max(0, box.ay - box.y - 10),
          horiz = box.width - 10;

      paths.push(`M0,${box.ay}q10,0 10,-10v${-vert}q0,-10 10,-10h${horiz}q10,0 10,10v${vert}q0,10 10,10`);

      // When the repeat is not greedy, the skip path gets a preference arrow.
      if (!this.greedy) {
        paths.push(`M10,${box.ay - 15}l5,5m-5,-5l-5,5`);
      }
    }

    return paths;
  },

  // Returns the path spec to render the line that repeats the content for
  // fragments that are matched more than once.
  loopPath(box) {
    var paths = [];

    if (this.hasLoop) {
      let vert = box.y2 - box.ay - 10;

      paths.push(`M${box.x},${box.ay}q-10,0 -10,10v${vert}q0,10 10,10h${box.width}q10,0 10,-10v${-vert}q0,-10 -10,-10`);

      // When the repeat is greedy, the loop path gets the preference arrow.
      if (this.greedy) {
        paths.push(`M${box.x2 + 10},${box.ay + 15}l5,-5m-5,5l-5,-5`);
      }
    }

    return paths;
  },

  setup() {
    this.minimum = this.properties.spec.minimum;
    this.maximum = this.properties.spec.maximum;
    this.greedy = (this.properties.greedy.textValue === '');
    this.hasSkip = (this.minimum === 0);
    this.hasLoop = (this.maximum === -1 || this.maximum > 1);
  }
}
