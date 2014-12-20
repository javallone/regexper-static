import javascript from 'src/js/parser/javascript/parser.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/any_character.js', function() {

  _.forIn({
    '\\b': 'word boundary',
    '\\B': 'non-word boundary',
    '\\d': 'digit',
    '\\D': 'non-digit',
    '\\f': 'form feed',
    '\\n': 'line feed',
    '\\r': 'carriage return',
    '\\s': 'white space',
    '\\S': 'non-white space',
    '\\t': 'tab',
    '\\v': 'vertical tab',
    '\\w': 'word',
    '\\W': 'non-word',
    '\\0': 'null',
    '\\1': 'Back reference (group = 1)',
    '\\2': 'Back reference (group = 2)',
    '\\3': 'Back reference (group = 3)',
    '\\4': 'Back reference (group = 4)',
    '\\5': 'Back reference (group = 5)',
    '\\6': 'Back reference (group = 6)',
    '\\7': 'Back reference (group = 7)',
    '\\8': 'Back reference (group = 8)',
    '\\9': 'Back reference (group = 9)',
    '\\012': 'octal: 12',
    '\\cx': 'ctrl-x',
    '\\xab': '0xAB',
    '\\uabcd': 'U+ABCD'
  }, (label, str) => {
    it(`parses "${str}" as an Escape`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__terminal()).toEqual(jasmine.objectContaining({
        type: 'escape',
        label
      }));
    });
  });

  describe('#_render', function() {

    beforeEach(function() {
      var parser = new javascript.Parser('\\b');
      this.node = parser.__consume__terminal();
      this.node.state = {};

      this.svg = Snap(document.createElement('svg'));
      this.node.container = this.svg.group();
      spyOn(this.node, 'renderLabel').and.callThrough();
    });

    it('renders a label', function() {
      this.node._render();
      expect(this.node.renderLabel).toHaveBeenCalledWith('word boundary');
    });

    it('sets the edge radius of the rect', function(done) {
      this.node._render()
        .then(label => {
          expect(label.select('rect').attr()).toEqual(jasmine.objectContaining({
            rx: '3',
            ry: '3'
          }));
        })
        .finally(done)
        .done();
    });

  });

});
