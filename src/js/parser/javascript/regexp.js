export default {
  matches() {
    if (this.elements[1].regexp) {
      return [this.match].concat(this.elements[1].regexp.matches());
    } else {
      return [this.match];
    }
  }
};
