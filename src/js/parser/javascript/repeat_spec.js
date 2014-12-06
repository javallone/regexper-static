export default {
  minimum() {
    if (this._min) {
      return Number(this._min.textValue);
    } else if (this._exact) {
      return Number(this._exact.textValue);
    } else {
      return 0;
    }
  },

  maximum() {
    if (this._max) {
      return Number(this._max.textValue);
    } else if (this._exact) {
      return Number(this._exact.textValue);
    } else {
      return -1;
    }
  }
};
