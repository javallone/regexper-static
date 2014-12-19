import { customEvent, normalizeBBox } from 'src/js/util.js';

describe('util.js', function() {

  describe('customEvent', function() {

    it('sets the event type', function() {
      var event = customEvent('example');
      expect(event.type).toEqual('example');
    });

    it('sets the event detail', function() {
      var event = customEvent('example', 'detail');
      expect(event.detail).toEqual('detail');
    });

  });

  describe('normalizeBBox', function() {

    it('defaults the anchor keys to values from the bbox', function() {
      expect(normalizeBBox({
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

});
