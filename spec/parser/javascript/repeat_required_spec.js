import javascript from 'src/js/parser/javascript/parser.js';

describe('parser/javascript/repeat_required.js', function() {

  it('parses "+" as a RepeatRequired', function() {
    var parser = new javascript.Parser('+');
    expect(parser.__consume__repeat_required()).toEqual(jasmine.objectContaining({
      minimum: 1,
      maximum: -1
    }));
  });

});
