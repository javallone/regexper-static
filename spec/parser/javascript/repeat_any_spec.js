import javascript from 'src/js/parser/javascript/parser.js';

describe('parser/javascript/repeat_any.js', function() {

  it('parses "*" as a RepeatAny', function() {
    var parser = new javascript.Parser('*');
    expect(parser.__consume__repeat_any()).toEqual(jasmine.objectContaining({
      minimum: 0,
      maximum: -1
    }));
  });

});
