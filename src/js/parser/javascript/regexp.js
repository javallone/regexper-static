import _ from 'lodash';
import Q from 'q';
import Base from './base.js';

export default _.extend({}, Base, {
  type: 'regexp',

  _render() {
    var matches = this.matches();

    if (matches.length === 1) {
      return this.proxy(matches[0]);
    } else {
      this.matchContainer = this.container.group()
        .addClass('regexp-matches');

      return Q.all(_.map(matches, (match => {
        return match.render(this.matchContainer.group());
      }).bind(this)));
    }
  },

  _position() {
    var matches = this.matches(),
        containerBox,
        paths;

    this.spaceVertically(matches, {
      padding: 5
    });

    this.matchContainer.transform(Snap.matrix()
      .translate(20, 0));

    containerBox = this.getBBox();
    paths = _.map(matches, match => {
      var box = match.getBBox(),
          direction = box.cy > containerBox.cy ? 1 : -1,
          distance = Math.abs(box.cy - containerBox.cy),
          pathStr;

      if (distance >= 15) {
        pathStr = [
          'M10,{box.cy}m0,{shift}q0,{curve} 10,{curve}',
          'M{containerBox.width},{box.cy}m30,{shift}q0,{curve} -10,{curve}'
        ].join('');
      } else {
        pathStr = [
          'M0,{containerBox.cy}c10,0 10,{anchor.y} 20,{anchor.y}',
          'M{containerBox.width},{containerBox.cy}m40,0c-10,0 -10,{anchor.y} -20,{anchor.y}'
        ].join('');
      }

      return Snap.format(pathStr, {
        containerBox,
        box,
        shift: -10 * direction,
        curve: 10 * direction,
        anchor: {
          x: box.x + 20,
          y: box.cy - containerBox.cy
        }
      });
    });

    paths.push(Snap.format([
      'M0,{box.cy}q10,0 10,-10V{top}',
      'M0,{box.cy}q10,0 10,10V{bottom}',
      'M{box.width},{box.cy}m40,0q-10,0 -10,-10V{top}',
      'M{box.width},{box.cy}m40,0q-10,0 -10,10V{bottom}'
    ].join(''), {
      box: containerBox,
      top: _.first(matches).getBBox().cy + 10,
      bottom: _.last(matches).getBBox().cy - 10
    }));

    this.container.prepend(
      this.container.path(paths.join('')));
  },

  matches() {
    return [this._match].concat(_.map(this._alternates.elements, _.property('match')));
  }
});
