import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset',

  render() {
    this.container.addClass('charset');

    this.label = this.container.text()
      .attr({
        text: this.invert() ? 'None of:' : 'One of:'
      });

    this.box = this.container.rect()
      .addClass('charset-box')
      .attr({
        rx: 3,
        ry: 3
      });

    this.partContainer = this.container.group();

    _.each(this.parts.elements, (part => {
      part.container = this.partContainer.group();
      part.render();
    }).bind(this));
  },

  position() {
    var box, offset = 0;

    _.each(this.parts.elements, (part => {
      var box;

      part.position();

      part.container.transform(Snap.matrix()
        .translate(0, offset));

      box = part.getBBox();

      offset += box.height + 5;
    }).bind(this));

    box = this.partContainer.getBBox();

    _.each(this.parts.elements, (part => {
      var partBox = part.getBBox();

      part.container.transform(Snap.matrix()
        .add(part.container.transform().localMatrix)
        .translate(box.cx - partBox.cx, 0));
    }).bind(this));

    this.box.attr({
      width: box.width + 10,
      height: box.height + 10
    });

    this.partContainer.transform(Snap.matrix()
      .translate(5, 5));
  },

  invert() {
    return this._invert.textValue !== '';
  }
});
