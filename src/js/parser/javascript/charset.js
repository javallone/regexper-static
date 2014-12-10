import _ from 'lodash';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'charset',

  render() {
    this.container.addClass('charset');

    this.label = this.container.text()
      .addClass('charset-label')
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
    var box;

    _.invoke(this.parts.elements, 'position');

    this.spaceVertically(this.parts.elements, {
      padding: 5
    });

    box = this.partContainer.getBBox();

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
