import _ from 'lodash';

export default {
  getBBox() {
    return this.container.getBBox();
  },

  renderLabel(container, text) {
    var group = container.group();

    group.rect();

    group.text().attr({
      text: text
    });

    return group;
  },

  positionLabel(group) {
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
      .addClass('bounding-box');
  },

  render() {
    console.log(this);

    this.container.addClass('placeholder');

    this.label = this.renderLabel(this.container, this.textValue);

    this.label.select('rect').attr({
      rx: 10,
      ry: 10
    });
  },

  position() {
    this.positionLabel(this.label);
  },

  spaceHorizontally(items, options) {
    var verticalCenter = 0;

    _.defaults(options, {
      padding: 0
    });

    _.reduce(items, (offset, item) => {
      var element = item.container || item,
          box;

      element.transform(Snap.matrix()
        .translate(offset, 0));

      box = item.getBBox();

      verticalCenter = Math.max(verticalCenter, box.cy);

      return offset + options.padding + box.width;
    }, 0);

    _.each(items, item => {
      var element = item.container || item;

      element.transform(Snap.matrix()
        .add(element.transform().localMatrix)
        .translate(0, verticalCenter - item.getBBox().cy));
    });
  }
};
