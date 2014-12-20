import javascript from 'src/js/parser/javascript/parser.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/any_character.js', function() {

  _.forIn({
    '\\b': 'backspace',
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
    '\\012': 'octal: 12',
    '\\cx': 'ctrl-x',
    '\\xab': '0xAB',
    '\\uabcd': 'U+ABCD'
  }, (label, str) => {
    it(`parses "${str}" as a CharsetEscape`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__charset_terminal()).toEqual(jasmine.objectContaining({
        type: 'charset-escape',
        label
      }));
    });
  });

});
