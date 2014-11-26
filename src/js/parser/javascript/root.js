export default {
  flags() {
    var flags;

    if (this.fl) {
      flags = this.fl.textValue;
    } else {
      flags = '';
    }

    return {
      global: /g/.test(flags),
      ignore_case: /i/.test(flags),
      multiline: /m/.test(flags)
    };
  },

  expression() {
    if (this.regexp) {
      return this.regexp;
    } else {
      return this;
    }
  }
};
