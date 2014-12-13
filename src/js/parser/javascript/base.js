import _ from 'lodash';
import Q from 'q';

export default {
  setContainer(container) {
    this.container = container;
    this.container.addClass(this.type);
  },

  getBBox() {
    return this.container.getBBox();
  },

  transform(matrix) {
    return this.container.transform(matrix);
  },

  renderLabel(text) {
    var deferred = Q.defer(),
        group = this.container.group()
          .addClass('label'),
        rect = group.rect(),
        text = group.text().attr({
          text: text
        });

    setTimeout(deferred.resolve.bind(deferred, group));
    deferred.promise.then(() => {
      var box = text.getBBox(),
          margin = 5;

      text.transform(Snap.matrix()
        .translate(margin, box.height + margin));

      rect.attr({
        width: box.width + 2 * margin,
        height: box.height + 2 * margin
      });
    });

    return deferred.promise;
  },

  render(container) {
    if (container) {
      this.setContainer(container);
    }

    return this._render().then(_.constant(this));
  },

  proxy(node) {
    return node.render(this.container);
  },

  _render() {
    console.log(this.type, this);

    this.container.addClass('placeholder');

    return this.renderLabel(this.type + ': ' + this.textValue).then(label => {
      label.select('rect').attr({
        rx: 10,
        ry: 10
      });
    });
  },

  spaceHorizontally(items, options) {
    var verticalCenter = 0;

    _.defaults(options, {
      padding: 0
    });

    _.reduce(items, (offset, item) => {
      var box;

      item.transform(Snap.matrix()
        .translate(offset, 0));

      box = item.getBBox();

      verticalCenter = Math.max(verticalCenter, box.cy);

      return offset + options.padding + box.width;
    }, 0);

    _.each(items, item => {
      item.transform(Snap.matrix()
        .add(item.transform().localMatrix)
        .translate(0, verticalCenter - item.getBBox().cy));
    });
  },

  spaceVertically(items, options) {
    var horizontalCenter = 0;

    _.defaults(options, {
      padding: 0
    });

    _.reduce(items, (offset, item) => {
      var box;

      item.transform(Snap.matrix()
        .translate(0, offset));

      box = item.getBBox();

      horizontalCenter = Math.max(horizontalCenter, box.cx);

      return offset + options.padding + box.height;
    }, 0);

    _.each(items, item => {
      item.transform(Snap.matrix()
        .add(item.transform().localMatrix)
        .translate(horizontalCenter - item.getBBox().cx, 0));
    });
  },

  renderLabeledBox(label, content, options) {
    var deferred = Q.defer(),
        label = this.container.text()
          .addClass([this.type, 'label'].join('-'))
          .attr({
            text: label
          }),
        box = this.container.rect()
          .addClass([this.type, 'box'].join('-'))
          .attr({
            rx: 3,
            ry: 3
          });

    _.defaults(options, {
      padding: 0
    });

    this.container.prepend(label);
    this.container.prepend(box);

    setTimeout(deferred.resolve);
    deferred.promise.then(() => {
      var labelBox = label.getBBox(),
          contentBox = content.getBBox();

      label.transform(Snap.matrix()
        .translate(0, labelBox.height));

      box
        .transform(Snap.matrix()
          .translate(0, labelBox.height))
        .attr({
          width: Math.max(contentBox.width + options.padding * 2, labelBox.width),
          height: contentBox.height + options.padding * 2
        });

      content.transform(Snap.matrix()
        .translate(box.getBBox().cx - contentBox.cx, labelBox.height + options.padding));
    });

    return deferred.promise;
  }
};
