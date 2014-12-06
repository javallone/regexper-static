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

  has_skip() {
    return this.minimum() === 0;
  },

  has_loop() {
    return this.maximum() === -1 || this.maximum() > 1;
  },

  content_position() {
    var x = 0, y = 0;

    if (this.has_skip()) {
      y = 10;
    }

    if (this.has_skip() || this.has_loop()) {
      x = 15;
    }

    return Snap.matrix().translate(x, y);
  }
}
