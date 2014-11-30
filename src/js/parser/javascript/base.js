export default {
  render_label(container, text) {
    var group = container.group();

    group.rect().attr({
      rx: 10,
      ry: 10
    });

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
    container.rect()
      .attr({
        'class': 'bounding-box',
        width: box.width,
        height: box.height
      })
      .transform(Snap.matrix()
        .translate(box.x, box.y));
  },

  render(container) {
    container.attr({ 'class': 'placeholder' });

    this.label = this.render_label(container, this.textValue);
  },

  position() {
    this.position_label(this.label);
  }
};
