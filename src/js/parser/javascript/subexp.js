import _ from 'lodash';
import Base from './base.js';

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
      this.container.addClass('subexp');

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

      this.regexp.container = this.container.group().transform(Snap.matrix()
        .translate(10, 10));
      this.regexp.render();
    } else {
      this.regexp.container = this.container;
      this.regexp.render();
    }
  },

  position() {
    var box;

    this.regexp.position();

    if (this.outline) {
      box = this.regexp.getBBox();

      this.outline.attr({
        width: box.width + 20,
        height: box.height + 20
      });

      this.container.path(Snap.format('M0,{content.cy}h10M{content.x2},{content.cy}H{container.x2}', {
        container: this.getBBox(),
        content: box
      }));
    }
  },

  groupLabel() {
    if (_.has(this.labelMap, this._capture.textValue)) {
      return this.labelMap[this._capture.textValue];
    } else {
      return 'group #TBA';
    }
  }
});
