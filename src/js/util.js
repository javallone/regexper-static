import _ from 'lodash';

export function customEvent(name, detail) {
  var evt = document.createEvent('Event');
  evt.initEvent(name, true, true);
  evt.detail = detail;
  return evt;
}


export function normalizeBBox(box) {
  return _.extend({
    ax: box.x,
    ax2: box.x2,
    ay: box.cy
  }, box);
}
