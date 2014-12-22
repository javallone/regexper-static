import javascript from 'src/js/parser/javascript/parser.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/charset_escape.js', function() {

  _.forIn({
    '\\b': { label: 'backspace', ordinal: 0x08 },
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
    '\\012': { label: 'octal: 12', ordinal: 10 },
    '\\cx': { label: 'ctrl-X', ordinal: 24 },
    '\\xab': { label: '0xAB', ordinal: 0xab },
    '\\uabcd': { label: 'U+ABCD', ordinal: 0xabcd }
  }, (content, str) => {
    it(`parses "${str}" as a CharsetEscape`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__charset_terminal()).toEqual(jasmine.objectContaining(content));
    });
  });

});
