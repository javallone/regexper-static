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
    var group = this.container.group()
      .addClass('label');

    group.rect();

    group.text().attr({
      text: text
    });

    this._labelGroups.push(group);

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

  render(container) {
    if (container) {
      this.setContainer(container);
    }

    this._labelGroups = [];
    return this._render().then((function() {
      if (!this._proxy) {
        _.each(this._labelGroups, this.positionLabel.bind(this));
        this._position();
      }

      return this;
    }).bind(this));
  },

  proxy(node) {
    this._proxy = node;
    return this._proxy.render(this.container);
  },

  terminalRender() {
    var deferred = Q.defer();

    setTimeout(() => { deferred.resolve() });
    return deferred.promise;
  },

  _render() {
    console.log(this.type, this);

    this.container.addClass('placeholder');

    this.renderLabel(this.type + ': ' + this.textValue)
      .select('rect').attr({
        rx: 10,
        ry: 10
      });

    return this.terminalRender();
  },

  _position() {},

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

  renderLabeledBox(label) {
    this.label = this.container.text()
      .addClass([this.type, 'label'].join('-'))
      .attr({
        text: label
      });

    this.box = this.container.rect()
      .addClass([this.type, 'box'].join('-'))
      .attr({
        rx: 3,
        ry: 3
      });
  },

  positionLabeledBox(content, options) {
    var labelBox, contentBox;

    _.defaults(options, {
      padding: 0
    });

    labelBox = this.label.getBBox();
    contentBox = content.getBBox();

    this.label.transform(Snap.matrix()
      .translate(0, labelBox.height));

    this.box
      .transform(Snap.matrix()
        .translate(0, labelBox.height))
      .attr({
        width: Math.max(contentBox.width + options.padding * 2, labelBox.width),
        height: contentBox.height + options.padding * 2
      });

    content.transform(Snap.matrix()
      .translate(this.box.getBBox().cx - contentBox.cx, labelBox.height + options.padding));
  }
};
