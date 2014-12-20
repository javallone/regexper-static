import javascript from 'src/js/parser/javascript/parser.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/any_character.js', function() {

  _.forIn({
    '*': {
      minimum: 0,
      maximum: -1,
      greedy: true,
      hasSkip: true,
      hasLoop: true
    },
    '*?': {
      minimum: 0,
      maximum: -1,
      greedy: false,
      hasSkip: true,
      hasLoop: true
    },
    '+': {
      minimum: 1,
      maximum: -1,
      greedy: true,
      hasSkip: false,
      hasLoop: true
    },
    '+?': {
      minimum: 1,
      maximum: -1,
      greedy: false,
      hasSkip: false,
      hasLoop: true
    },
    '?': {
      minimum: 0,
      maximum: 1,
      greedy: true,
      hasSkip: true,
      hasLoop: false
    },
    '??': {
      minimum: 0,
      maximum: 1,
      greedy: false,
      hasSkip: true,
      hasLoop: false
    },
    '{1}': {
      minimum: 1,
      maximum: 1,
      greedy: true,
      hasSkip: false,
      hasLoop: false
    },
    '{1}?': {
      minimum: 1,
      maximum: 1,
      greedy: false,
      hasSkip: false,
      hasLoop: false
    },
    '{2}': {
      minimum: 2,
      maximum: 2,
      greedy: true,
      hasSkip: false,
      hasLoop: true
    },
    '{2}?': {
      minimum: 2,
      maximum: 2,
      greedy: false,
      hasSkip: false,
      hasLoop: true
    },
    '{0,}': {
      minimum: 0,
      maximum: -1,
      greedy: true,
      hasSkip: true,
      hasLoop: true
    },
    '{0,}?': {
      minimum: 0,
      maximum: -1,
      greedy: false,
      hasSkip: true,
      hasLoop: true
    },
    '{1,}': {
      minimum: 1,
      maximum: -1,
      greedy: true,
      hasSkip: false,
      hasLoop: true
    },
    '{1,}?': {
      minimum: 1,
      maximum: -1,
      greedy: false,
      hasSkip: false,
      hasLoop: true
    },
    '{0,1}': {
      minimum: 0,
      maximum: 1,
      greedy: true,
      hasSkip: true,
      hasLoop: false
    },
    '{0,1}?': {
      minimum: 0,
      maximum: 1,
      greedy: false,
      hasSkip: true,
      hasLoop: false
    },
    '{0,2}': {
      minimum: 0,
      maximum: 2,
      greedy: true,
      hasSkip: true,
      hasLoop: true
    },
    '{0,2}?': {
      minimum: 0,
      maximum: 2,
      greedy: false,
      hasSkip: true,
      hasLoop: true
    },
    '{1,2}': {
      minimum: 1,
      maximum: 2,
      greedy: true,
      hasSkip: false,
      hasLoop: true
    },
    '{1,2}?': {
      minimum: 1,
      maximum: 2,
      greedy: false,
      hasSkip: false,
      hasLoop: true
    }
  }, (content, str) => {
    it(`parses "${str}" as a Repeat`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__repeat()).toEqual(jasmine.objectContaining(content));
    });
  });

  describe('contentPosition property', function() {

    pending();

  });

  describe('label property', function() {

    pending();

  });

});
