import javascript from 'src/js/parser/javascript/parser.js';

describe('parser/javascript/any_character.js', function() {

  it('parses "." as an AnyCharacter', function() {
    var parser = new javascript.Parser('.');
    expect(parser.__consume__terminal()).toEqual(jasmine.objectContaining({
      type: 'any-character'
    }));
  });

  describe('#_render', function() {

    beforeEach(function() {
      var parser = new javascript.Parser('.');
      this.node = parser.__consume__terminal();
    });

    it('renders a label', function() {
      spyOn(this.node, 'renderLabel').and.returnValue('rendered label');
      expect(this.node._render()).toEqual('rendered label');
      expect(this.node.renderLabel).toHaveBeenCalledWith('any character');
    });

  });

});
