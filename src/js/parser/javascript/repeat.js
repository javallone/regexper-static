export default {
  minimum() {
    return this._spec.minimum();
  },

  maximum() {
    return this._spec.maximum();
  },

  greedy() {
    return (this._greedy.textValue === '');
  },

  hasSkip() {
    return this.minimum() === 0;
  },

  hasLoop() {
    return this.maximum() === -1 || this.maximum() > 1;
  },

  contentPosition() {
    var x = 0, y = 0;

    if (this.hasLoop()) {
      x = 10;
    }

    if (this.hasSkip()) {
      y = 10;
      x = 15;
    }

    return Snap.matrix().translate(x, y);
  },

  label() {
    var maximum = this.maximum(),
        minimum = this.minimum(),
        formatTimes = times => {
          if (times === 1) {
            return 'once';
          } else {
            return `${times} times`;
          }
        };

    if (minimum >= 2 && maximum === -1) {
      return `${minimum - 1}+ times`;
    } else if (minimum <= 1 && maximum >= 2) {
      return `at most ${formatTimes(maximum - 1)}`;
    } else if (minimum >= 2 && maximum >= 2) {
      if (minimum === maximum) {
        return formatTimes(minimum - 1);
      } else {
        return `${minimum - 1}...${formatTimes(maximum - 1)}`;
      }
    }
  }
}
