import util from '../../util.js';
import _ from 'lodash';

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

  transform(matrix) {
    return this.container.transform(matrix);
  }

  deferredStep() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.state.cancelRender) {
          reject('Render cancelled');
        } else {
          resolve.apply(this, arguments);
        }
      }, 1);
    });
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
    this.state.renderCounter--;
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
        .then(
          () => {
            this.doneRender();
            return this;
          },
          null,
          progress => {
            if (typeof progress.value !== 'undefined') {
              return progress.value;
            } else {
              return progress;
            }
          }
        );
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
