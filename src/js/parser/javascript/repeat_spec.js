// RepeatSpec nodes are used for `a{m,n}` regular expression syntax. It is not
// rendered directly; it just indicates how many times the
// [Repeat](./repeat.html) node loops.

export default {
  setup() {
    if (this.properties.min) {
      this.minimum = Number(this.properties.min.textValue);
    } else if (this.properties.exact) {
      this.minimum = Number(this.properties.exact.textValue);
    } else {
      this.minimum = 0;
    }

    if (this.properties.max) {
      this.maximum = Number(this.properties.max.textValue);
    } else if (this.properties.exact) {
      this.maximum = Number(this.properties.exact.textValue);
    } else {
      this.maximum = -1;
    }

    // Report invalid repeat when the minimum is larger than the maximum.
    if (this.minimum > this.maximum && this.maximum !== -1) {
      throw `Numbers out of order: ${this.textValue}`;
    }
  }
};
