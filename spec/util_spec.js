import util from '../src/js/util.js';

describe('util.js', function() {

  describe('customEvent', function() {

    it('sets the event type', function() {
      var event = util.customEvent('example');
      expect(event.type).toEqual('example');
    });

    it('sets the event detail', function() {
      var event = util.customEvent('example', 'detail');
      expect(event.detail).toEqual('detail');
    });

  });

  describe('normalizeBBox', function() {

    it('defaults the anchor keys to values from the bbox', function() {
      expect(util.normalizeBBox({
        x: 'bbox x',
        x2: 'bbox x2',
        cy: 'bbox cy',
        ay: 'bbox ay'
      })).toEqual({
        x: 'bbox x',
        x2: 'bbox x2',
        cy: 'bbox cy',
        ax: 'bbox x',
        ax2: 'bbox x2',
        ay: 'bbox ay'
      });
    });

  });

  describe('spaceHorizontally', function() {

    it('positions each item', function() {
      var svg = Snap(document.createElement('svg')),
          items = [
            svg.group(),
            svg.group(),
            svg.group()
          ];

      spyOn(items[0], 'getBBox').and.returnValue({ ay: 5, width: 10 });
      spyOn(items[1], 'getBBox').and.returnValue({ ay: 15, width: 30 });
      spyOn(items[2], 'getBBox').and.returnValue({ ay: 10, width: 20 });
      spyOn(items[0], 'transform').and.callThrough();
      spyOn(items[1], 'transform').and.callThrough();
      spyOn(items[2], 'transform').and.callThrough();

      util.spaceHorizontally(items, { padding: 5 });

      expect(items[0].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(0, 10));
      expect(items[1].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(15, 0));
      expect(items[2].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(50, 5));
    });

  });

  describe('spaceVertically', function() {

    it('positions each item', function() {
      var svg = Snap(document.createElement('svg')),
          items = [
            svg.group(),
            svg.group(),
            svg.group()
          ];

      spyOn(items[0], 'getBBox').and.returnValue({ cx: 5, height: 10 });
      spyOn(items[1], 'getBBox').and.returnValue({ cx: 15, height: 30 });
      spyOn(items[2], 'getBBox').and.returnValue({ cx: 10, height: 20 });
      spyOn(items[0], 'transform').and.callThrough();
      spyOn(items[1], 'transform').and.callThrough();
      spyOn(items[2], 'transform').and.callThrough();

      util.spaceVertically(items, { padding: 5 });

      expect(items[0].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(10, 0));
      expect(items[1].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(0, 15));
      expect(items[2].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(5, 50));
    });

  });

});
