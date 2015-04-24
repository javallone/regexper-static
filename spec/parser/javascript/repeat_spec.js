import javascript from 'src/js/parser/javascript/parser.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/repeat.js', function() {

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

    beforeEach(function() {
      this.node = new javascript.Parser('*').__consume__repeat();
    });

    _.each([
      {
        hasLoop: false,
        hasSkip: false,
        translate: { x: 0, y: 0 }
      },
      {
        hasLoop: true,
        hasSkip: false,
        translate: { x: 10, y: 0 }
      },
      {
        hasLoop: false,
        hasSkip: true,
        translate: { x: 15, y: 10 }
      },
      {
        hasLoop: true,
        hasSkip: true,
        translate: { x: 15, y: 10 }
      }
    ], t => {
      it(`translates to [${t.translate.x}, ${t.translate.y}] when hasLoop is ${t.hasLoop} and hasSkip is ${t.hasSkip}`, function() {
        this.node.hasLoop = t.hasLoop;
        this.node.hasSkip = t.hasSkip;
        expect(this.node.contentPosition).toEqual(Snap.matrix()
          .translate(t.translate.x, t.translate.y));
      });
    });

  });

  describe('label property', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('*').__consume__repeat();
    });

    _.each([
      {
        minimum: 1,
        maximum: -1,
        label: undefined
      },
      {
        minimum: 2,
        maximum: -1,
        label: '1+ times'
      },
      {
        minimum: 3,
        maximum: -1,
        label: '2+ times'
      },
      {
        minimum: 0,
        maximum: 2,
        label: 'at most once'
      },
      {
        minimum: 0,
        maximum: 3,
        label: 'at most 2 times'
      },
      {
        minimum: 2,
        maximum: 2,
        label: 'once'
      },
      {
        minimum: 3,
        maximum: 3,
        label: '2 times'
      },
      {
        minimum: 2,
        maximum: 3,
        label: '1\u20262 times'
      },
      {
        minimum: 3,
        maximum: 4,
        label: '2\u20263 times'
      }

    ], t => {
      it(`is "${t.label}" when minimum=${t.minimum} and maximum=${t.maximum}`, function() {
        this.node.minimum = t.minimum;
        this.node.maximum = t.maximum;
        expect(this.node.label).toEqual(t.label);
      });
    });

  });

  describe('#skipPath', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('*').__consume__repeat();

      this.box = {
        y: 11,
        ay: 22,
        width: 33
      };
    });

    it('returns nothing when there is no skip', function() {
      this.node.hasSkip = false;
      expect(this.node.skipPath(this.box)).toEqual([]);
    });

    it('returns a path when there is a skip', function() {
      this.node.hasSkip = true;
      this.node.greedy = true;
      expect(this.node.skipPath(this.box)).toEqual([
        'M0,22q10,0 10,-10v-1q0,-10 10,-10h23q10,0 10,10v1q0,10 10,10'
      ]);
    });

    it('returns a path with arrow when there is a non-greedy skip', function() {
      this.node.hasSkip = true;
      this.node.greedy = false;
      expect(this.node.skipPath(this.box)).toEqual([
        'M0,22q10,0 10,-10v-1q0,-10 10,-10h23q10,0 10,10v1q0,10 10,10',
        'M10,7l5,5m-5,-5l-5,5'
      ]);
    });

  });

  describe('#loopPath', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('*').__consume__repeat();

      this.box = {
        x: 11,
        x2: 22,
        ay: 33,
        y2: 44,
        width: 55
      };
    });

    it('returns nothing when there is no loop', function() {
      this.node.hasLoop = false;
      expect(this.node.loopPath(this.box)).toEqual([]);
    });

    it('returns a path when there is a loop', function() {
      this.node.hasLoop = true;
      this.node.greedy = false;
      expect(this.node.loopPath(this.box)).toEqual([
        'M11,33q-10,0 -10,10v1q0,10 10,10h55q10,0 10,-10v-1q0,-10 -10,-10'
      ]);
    });

    it('returns a path with arrow when there is a greedy loop', function() {
      this.node.hasLoop = true;
      this.node.greedy = true;
      expect(this.node.loopPath(this.box)).toEqual([
        'M11,33q-10,0 -10,10v1q0,10 10,10h55q10,0 10,-10v-1q0,-10 -10,-10',
        'M32,48l5,-5m-5,5l-5,-5'
      ]);
    });

  });

});
