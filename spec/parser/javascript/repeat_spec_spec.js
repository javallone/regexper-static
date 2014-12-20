import javascript from 'src/js/parser/javascript/parser.js';

describe('parser/javascript/repeat_spec.js', function() {

  it('parses "{n,m}" as a RepeatSpec (with minimum and maximum values)', function() {
    var parser = new javascript.Parser('{24,42}');
    expect(parser.__consume__repeat_spec()).toEqual(jasmine.objectContaining({
      minimum: 24,
      maximum: 42
    }));
  });

  it('parses "{n,}" as a RepeatSpec (with only minimum value)', function() {
    var parser = new javascript.Parser('{24,}');
    expect(parser.__consume__repeat_spec()).toEqual(jasmine.objectContaining({
      minimum: 24,
      maximum: -1
    }));
  });

  it('parses "{n}" as a RepeatSpec (with an exact count)', function() {
    var parser = new javascript.Parser('{24}');
    expect(parser.__consume__repeat_spec()).toEqual(jasmine.objectContaining({
      minimum: 24,
      maximum: 24
    }));
  });

  it('does not parse "{,m}" as a RepeatSpec', function() {
    var parser = new javascript.Parser('{,42}');
    expect(parser.__consume__repeat_spec()).toEqual(null);
  });

  it('throws an exception when the numbers are out of order', function() {
    var parser = new javascript.Parser('{42,24}');
    expect(() => {
      parser.__consume__repeat_spec();
    }).toThrow('Numbers out of order: {42,24}');
  });

});
