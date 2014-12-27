import javascript from 'src/js/parser/javascript/parser.js';
import Snap from 'snapsvg';

describe('parser/javascript/literal.js', function() {

  it('parses "x" as a Literal', function() {
    var parser = new javascript.Parser('x');
    expect(parser.__consume__terminal()).toEqual(jasmine.objectContaining({
      type: 'literal',
      literal: 'x',
      ordinal: 120
    }));
  });

  it('parses "\\x" as a Literal', function() {
    var parser = new javascript.Parser('\\x');
    expect(parser.__consume__terminal()).toEqual(jasmine.objectContaining({
      type: 'literal',
      literal: 'x',
      ordinal: 120
    }));
  });

  describe('#_render', function() {

    beforeEach(function() {
      var parser = new javascript.Parser('a');
      this.node = parser.__consume__terminal();
      this.node.state = {};

      this.svg = Snap(document.createElement('svg'));
      this.node.container = this.svg.group();
      spyOn(this.node, 'renderLabel').and.callThrough();
    });

    it('renders a label', function() {
      this.node._render();
      expect(this.node.renderLabel).toHaveBeenCalledWith(['\u201c', 'a', '\u201d']);
    });

    it('sets the class of the first and third tspan to "quote"', function(done) {
      this.node._render()
        .then(label => {
          expect(label.selectAll('tspan')[0].hasClass('quote')).toBeTruthy();
          expect(label.selectAll('tspan')[2].hasClass('quote')).toBeTruthy();
        }, fail)
        .finally(done)
        .done();
    });

    it('sets the edge radius of the rect', function(done) {
      this.node._render()
        .then(label => {
          expect(label.select('rect').attr()).toEqual(jasmine.objectContaining({
            rx: '3',
            ry: '3'
          }));
        }, fail)
        .finally(done)
        .done();
    });

  });

  describe('#merge', function() {

    beforeEach(function() {
      var parser = new javascript.Parser('a');
      this.node = parser.__consume__terminal();
    });

    it('appends to the literal value', function() {
      this.node.merge({ literal: 'b' });
      expect(this.node.literal).toEqual('ab');
    });

  });

});
