import _ from 'lodash';
import Base from './base.js';

var groupCounter = 1;

export default _.extend({}, Base, {
  type: 'subexp',

  labelMap: {
    '?:': '',
    '?=': 'positive lookahead',
    '?!': 'negative lookahead'
  },

  render() {
    var label = this.groupLabel();

    if (label) {
      this.label = this.container.text()
        .addClass('subexp-label')
        .attr({
          text: label
        });

      this.outline = this.container.rect()
        .addClass('subexp-outline')
        .attr({
          rx: 3,
          ry: 3
        });

      this.regexp.setContainer(this.container.group());
      this.regexp.render();
    } else {
      this.regexp.setContainer(this.container);
      this.regexp.render();
    }
  },

  position() {
    var box;

    this.regexp.position();

    if (this.outline) {
      box = this.label.getBBox();

      this.label.transform(Snap.matrix()
        .translate(0, box.height));

      this.regexp.container.transform(Snap.matrix()
        .translate(10, 10 + box.height));

      box = this.regexp.getBBox();

      this.outline
        .transform(Snap.matrix()
          .translate(box.x - 10, box.y - 10))
        .attr({
          width: box.width + 20,
          height: box.height + 20
        });
    }
  },

  groupLabel() {
    if (_.has(this.labelMap, this._capture.textValue)) {
      return this.labelMap[this._capture.textValue];
    } else {
      return 'group #' + (groupCounter++);
    }
  },

  resetCounter() {
    groupCounter = 1;
  },
});
