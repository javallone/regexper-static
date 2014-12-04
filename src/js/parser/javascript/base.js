export default {
  render_label(container, text) {
    var group = container.group();

    group.rect();

    group.text().attr({
      text: text
    });

    return group;
  },

  position_label(group) {
    var text = group.select('text'),
        rect = group.select('rect'),
        box = text.getBBox(),
        margin = 5;

    text.transform(Snap.matrix()
      .translate(margin, box.height + margin));

    rect.attr({
      width: box.width + 2 * margin,
      height: box.height + 2 * margin
    });
  },

  render_bbox(container, box) {
    container.path(box.path)
      .attr({
        'class': 'bounding-box'
      });
  },

  render() {
    this.container.attr({ 'class': 'placeholder' });

    this.label = this.render_label(this.container, this.textValue);

    this.label.select('rect').attr({
      rx: 10,
      ry: 10
    });
  },

  position() {
    this.position_label(this.label);
  }
};
