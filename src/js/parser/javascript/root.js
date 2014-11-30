export default {
  render(container) {
    container.attr({ 'class': 'placeholder' });

    this.rect = container.rect().attr({
      rx: 10,
      ry: 10
    });

    this.text = container.text().attr({
      text: this.textValue
    });
  },

  position() {
    var box = this.text.getBBox(),
        margin = 5;

    this.text.transform(Snap.matrix()
      .translate(margin, box.height + margin));

    this.rect.attr({
      width: box.width + 2 * margin,
      height: box.height + 2 * margin
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
