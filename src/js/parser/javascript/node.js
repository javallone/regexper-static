// Base class for all nodes in the parse tree. An instance of this class is
// created for each parsed node, and then extended with one of the node-type
// modules.
import util from '../../util.js';
import _ from 'lodash';

export default class Node {
  // Arguments passed in are defined by the canopy tool.
  constructor(textValue, offset, elements, properties) {
    this.textValue = textValue;
    this.offset = offset;
    this.elements = elements || [];

    this.properties = properties;

    // This is the current parser state (an instance
    // [ParserState](./parser_state.html).)
    this.state = Node.state;
  }

  // Node-type module to extend the Node instance with. Setting of this is
  // done by canopy during parsing and is setup in [parser.js](./parser.html).
  set module(mod) {
    _.extend(this, mod);

    if (this.setup) {
      this.setup();
    }

    _.forOwn(this.definedProperties || {}, (methods, name) => {
      Object.defineProperty(this, name, methods);
    });

    delete this.definedProperties;
  }

  // The SVG element to render this node into. A node-type class is
  // automatically added to the container. The class to set is defined on the
  // module set during parsing.
  set container(container) {
    this._container = container;
    this._container.addClass(this.type);
  }

  get container() {
    return this._container;
  }

  // The anchor defined the points on the left and right of the rendered node
  // that the centerline of the rendered expression connects to. For most
  // nodes, this element will be defined by the normalizeBBox method in
  // [Util](../../util.html).
  get anchor() {
    if (this.proxy) {
      return this.proxy.anchor;
    } else {
      return this._anchor || {};
    }
  }

  // Returns the bounding box of the container with the anchor included.
  getBBox() {
    return _.extend(util.normalizeBBox(this.container.getBBox()), this.anchor);
  }

  // Transforms the container.
  //
  // - __matrix__ - A matrix transform to be applied. Created using Snap.svg.
  transform(matrix) {
    return this.container.transform(matrix);
  }

  // Returns a Promise that will be resolved with the provided value. If the
  // render is cancelled before the Promise is resolved, then an exception will
  // be thrown to halt any rendering.
  //
  // - __value__ - Value to resolve the returned promise with.
  deferredStep(value) {
    return util.tick().then(() => {
      if (this.state.cancelRender) {
        throw 'Render cancelled';
      }

      return value;
    });
  }

  // Render this node.
  //
  // - __container__ - Optional element to render this node into. A container
  //    must be specified, but if it has already been set, then it does not
  //    need to be provided to render.
  render(container) {
    if (container) {
      this.container = container;
    }

    if (this.proxy) {
      // For nodes that proxy to a child node, just render the child.
      return this.proxy.render(this.container);
    } else {
      // Non-proxied nodes call their _render method (defined by the node-type
      // module).
      this.state.renderCounter++;
      return this._render()
        .then(() => {
          this.state.renderCounter--;
          return this;
        });
    }
  }

  // Renders a label centered within a rectangle which can be styled. Returns
  // a Promise which will be resolved with the SVG group the rect and text are
  // rendered in.
  //
  // - __text__ - String or array of strings to render as a label.
  renderLabel(text) {
    var group = this.container.group()
          .addClass('label'),
        rect = group.rect(),
        text = group.text(0, 0, _.flatten([text]));

    return this.deferredStep()
      .then(() => {
        let box = text.getBBox(),
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

  // Renders a labeled box around another SVG element. Returns a Promise.
  //
  // - __label__ - String or array of strings to label the box with.
  // - __content__ - SVG element to wrap in the box.
  // - __options.padding__ - Pixels of padding to place between the content and
  //    the box.
  renderLabeledBox(label, content, options) {
    var label = this.container.text(0, 0, _.flatten([label]))
          .addClass(`${this.type}-label`),
        box = this.container.rect()
          .addClass(`${this.type}-box`)
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
        let labelBox = label.getBBox(),
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
