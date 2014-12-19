import { customEvent } from 'src/js/util.js';

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

});
