import javascript from 'src/js/parser/javascript/parser.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/escape.js', function() {

  _.forIn({
    '\\b': { label: 'word boundary', ordinal: -1 },
    '\\B': { label: 'non-word boundary', ordinal: -1 },
    '\\d': { label: 'digit', ordinal: -1 },
    '\\D': { label: 'non-digit', ordinal: -1 },
    '\\f': { label: 'form feed', ordinal: 0x0c },
    '\\n': { label: 'line feed', ordinal: 0x0a },
    '\\r': { label: 'carriage return', ordinal: 0x0d },
    '\\s': { label: 'white space', ordinal: -1 },
    '\\S': { label: 'non-white space', ordinal: -1 },
    '\\t': { label: 'tab', ordinal: 0x09 },
    '\\v': { label: 'vertical tab', ordinal: 0x0b },
    '\\w': { label: 'word', ordinal: -1 },
    '\\W': { label: 'non-word', ordinal: -1 },
    '\\0': { label: 'null', ordinal: 0 },
    '\\1': { label: 'Back reference (group = 1)', ordinal: -1 },
    '\\2': { label: 'Back reference (group = 2)', ordinal: -1 },
    '\\3': { label: 'Back reference (group = 3)', ordinal: -1 },
    '\\4': { label: 'Back reference (group = 4)', ordinal: -1 },
    '\\5': { label: 'Back reference (group = 5)', ordinal: -1 },
    '\\6': { label: 'Back reference (group = 6)', ordinal: -1 },
    '\\7': { label: 'Back reference (group = 7)', ordinal: -1 },
    '\\8': { label: 'Back reference (group = 8)', ordinal: -1 },
    '\\9': { label: 'Back reference (group = 9)', ordinal: -1 },
    '\\012': { label: 'octal: 12', ordinal: 10 },
    '\\cx': { label: 'ctrl-X', ordinal: 24 },
    '\\xab': { label: '0xAB', ordinal: 0xab },
    '\\uabcd': { label: 'U+ABCD', ordinal: 0xabcd }
  }, (content, str) => {
    it(`parses "${str}" as an Escape`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__terminal()).toEqual(jasmine.objectContaining(content));
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
