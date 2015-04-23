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

  setup() {
    this.minimum = this.properties.spec.minimum;
    this.maximum = this.properties.spec.maximum;
    this.greedy = (this.properties.greedy.textValue === '');
    this.hasSkip = (this.minimum === 0);
    this.hasLoop = (this.maximum === -1 || this.maximum > 1);
  }
}
