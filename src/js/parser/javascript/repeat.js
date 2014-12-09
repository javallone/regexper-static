export default {
  minimum() {
    return this._spec.minimum();
  },

  maximum() {
    return this._spec.maximum();
  },

  greedy() {
    return (this._greedy.textValue !== '');
  },

  hasSkip() {
    return this.minimum() === 0;
  },

  hasLoop() {
    return this.maximum() === -1 || this.maximum() > 1;
  },

  contentPosition() {
    var x = 0, y = 0;

    if (this.hasSkip()) {
      y = 10;
    }

    if (this.hasSkip() || this.hasLoop()) {
      x = 15;
    }

    return Snap.matrix().translate(x, y);
  }
}
