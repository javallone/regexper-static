function formatTimes(times) {
  if (times === 1) {
    return 'once';
  } else {
    return `${times} times`;
  }
}

export default {
  definedProperties: {
    contentPosition: {
      get: function() {
        var x = 0, y = 0;

        if (this.hasLoop) {
          x = 10;
        }

        if (this.hasSkip) {
          y = 10;
          x = 15;
        }

        return Snap.matrix().translate(x, y);
      }
    },

    label: {
      get: function() {
        if (this.minimum >= 2 && this.maximum === -1) {
          return `${this.minimum - 1}+ times`;
        } else if (this.minimum <= 1 && this.maximum >= 2) {
          return `at most ${formatTimes(this.maximum - 1)}`;
        } else if (this.minimum >= 2 && this.maximum >= 2) {
          if (this.minimum === this.maximum) {
            return formatTimes(this.minimum - 1);
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
