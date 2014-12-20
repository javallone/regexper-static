import _ from 'lodash';

function customEvent(name, detail) {
  var evt = document.createEvent('Event');
  evt.initEvent(name, true, true);
  evt.detail = detail;
  return evt;
}


function normalizeBBox(box) {
  return _.extend({
    ax: box.x,
    ax2: box.x2,
    ay: box.cy
  }, box);
}

function spaceHorizontally(items, options) {
  var verticalCenter = 0;

  options = _.defaults(options || {}, {
    padding: 0
  });

  _.reduce(items, (offset, item) => {
    var box;

    item.transform(Snap.matrix()
      .translate(offset, 0));

    box = normalizeBBox(item.getBBox());
    verticalCenter = Math.max(verticalCenter, box.ay);

    return offset + options.padding + box.width;
  }, 0);

  for (var item of items) {
    let box = normalizeBBox(item.getBBox());

    item.transform(Snap.matrix()
      .add(item.transform().localMatrix)
      .translate(0, verticalCenter - box.ay));
  }
}

function spaceVertically(items, options) {
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

export default {
  customEvent,
  normalizeBBox,
  spaceHorizontally,
  spaceVertically
};
