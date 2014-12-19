import { customEvent } from '../../util.js';
import _ from 'lodash';
import Q from 'q';

export default class Node {
  constructor(textValue, offset, elements, properties) {
    this.textValue = textValue;
    this.offset = offset;
    this.elements = elements || [];

    this.properties = properties;

    this.state = Node.state;
  }

  set module(mod) {
    _.extend(this, mod);

    if (this.setup) {
      this.setup();
    }

    _.forOwn(this.definedProperties || {}, (methods, name) => {
      Object.defineProperty(this, name, methods);
    });
  }

  set container(container) {
    this._container = container;
    this._container.addClass(this.type);
  }

  get container() {
    return this._container;
  }

  get anchor() {
    var box;

    if (this.proxy) {
      return this.proxy.anchor;
    } else {
      box = this.container.getBBox();

      return _.extend({
        ax: box.x,
        ax2: box.x2,
        ay: box.cy
      }, this._anchor || {});
    }
  }

  getBBox() {
    return _.extend(this.container.getBBox(), this.anchor);
  }

  normalizeBBox(box) {
    return _.extend({
      ax: box.x,
      ax2: box.x2,
      ay: box.cy
    }, box);
  }

  transform(matrix) {
    return this.container.transform(matrix);
  }

  deferredStep() {
    var deferred = Q.defer(),
        result = arguments;

    setTimeout(() => {
      if (this.state.cancelRender) {
        deferred.reject('Render cancelled');
      } else {
        deferred.resolve.apply(this, result);
      }
    }, 1);

    return deferred.promise;
  }

  renderLabel(text) {
    var group = this.container.group()
          .addClass('label'),
        rect = group.rect(),
        text = group.text(0, 0, _.flatten([text]));

    return this.deferredStep(group)
      .then(group => {
        var box = text.getBBox(),
            margin = 5;

        text.transform(Snap.matrix()
          .translate(margin, box.height / 2 + 2 * margin));

        rect.attr({
          width: box.width + 2 * margin,
          height: box.height + 2 * margin
        });

        return group;
      });
  }

  startRender() {
    this.state.renderCounter++;
  }

  doneRender() {
    if (this.state.maxCounter === 0) {
      this.state.maxCounter = this.state.renderCounter;
    }

    this.state.renderCounter--;

    document.body.dispatchEvent(customEvent('updateStatus', {
      percentage: (this.state.maxCounter - this.state.renderCounter) / this.state.maxCounter
    }));

    return this.deferredStep();
  }

  render(container) {
    if (container) {
      this.container = container;
    }

    if (this.proxy) {
      return this.proxy.render(this.container);
    } else {
      this.startRender();
      return this._render()
        .then(this.doneRender.bind(this))
        .then(_.constant(this));
    }
  }

  spaceHorizontally(items, options) {
    var verticalCenter = 0;

    options = _.defaults(options || {}, {
      padding: 0
    });

    _.reduce(items, (offset, item) => {
      var box;

      item.transform(Snap.matrix()
        .translate(offset, 0));

      box = this.normalizeBBox(item.getBBox());
      verticalCenter = Math.max(verticalCenter, box.ay);

      return offset + options.padding + box.width;
    }, 0);

    for (var item of items) {
      let box = this.normalizeBBox(item.getBBox());

      item.transform(Snap.matrix()
        .add(item.transform().localMatrix)
        .translate(0, verticalCenter - box.ay));
    }
  }

  spaceVertically(items, options) {
    var horizontalCenter = 0;

    options = _.defaults(options || {}, {
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

    for (var item of items) {
      item.transform(Snap.matrix()
        .add(item.transform().localMatrix)
        .translate(horizontalCenter - item.getBBox().cx, 0));
    }
  }

  renderLabeledBox(label, content, options) {
    var label = this.container.text(0, 0, label)
          .addClass([this.type, 'label'].join('-')),
        box = this.container.rect()
          .addClass([this.type, 'box'].join('-'))
          .attr({
            rx: 3,
            ry: 3
          });

    options = _.defaults(options || {}, {
      padding: 0
    });

    this.container.prepend(label);
    this.container.prepend(box);

    return this.deferredStep()
      .then(() => {
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
  }
};
