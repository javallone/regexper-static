export default {
  render(container) {
    this.rect = this.container.rect().attr({
      x: 5,
      y: 5,
      rx: 10,
      ry: 10,
      fill: '#f00'
    });
    this.text = this.container.text(0, 0, this.textValue).attr({
      fill: '#fff',
      fontWeight: 'bold'
    });
  },

  position() {
    var box = this.text.getBBox();

    this.container.attr({
      width: box.width + 20,
      height: box.height + 20
    });

    this.text.attr({
      x: 10,
      y: box.height + 5
    });

    this.rect.attr({
      width: box.width + 10,
      height: box.height + 10
    });
  },

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
