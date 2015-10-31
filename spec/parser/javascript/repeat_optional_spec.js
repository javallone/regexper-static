import javascript from '../../../src/js/parser/javascript/parser.js';

describe('parser/javascript/repeat_optional.js', function() {

  it('parses "?" as a RepeatOptional', function() {
    var parser = new javascript.Parser('?');
    expect(parser.__consume__repeat_optional()).toEqual(jasmine.objectContaining({
      minimum: 0,
      maximum: 1
    }));
  });

});
