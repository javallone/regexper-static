import javascript from 'src/js/parser/javascript/parser.js';
import _ from 'lodash';
import Snap from 'snapsvg';
import Q from 'q';

describe('parser/javascript/match_fragment.js', function() {

  _.forIn({
    'a': {
      proxy: jasmine.objectContaining({ textValue: 'a' }),
      canMerge: true
    },
    '\\b': {
      proxy: jasmine.objectContaining({ textValue: '\\b' }),
      canMerge: false
    },
    'a*': {
      content: jasmine.objectContaining({ textValue: 'a' }),
      repeat: jasmine.objectContaining({ textValue: '*' }),
      canMerge: false
    }
  }, (content, str) => {
    it(`parses "${str}" as a MatchFragment`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__match_fragment()).toEqual(jasmine.objectContaining(content));
    });
  });

  describe('_anchor property', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a').__consume__match_fragment();

      this.node.content = {
        anchor: {
          ax: 1,
          ax2: 2,
          ay: 3
        }
      };
      spyOn(this.node, 'transform').and.returnValue({
        localMatrix: Snap.matrix().translate(10, 20)
      });
    });

    it('applies the local transform to the content anchor', function() {
      expect(this.node._anchor).toEqual({
        ax: 11,
        ax2: 12,
        ay: 23
      });
    });

  });

  describe('#_render', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a').__consume__match_fragment();

      this.node.container = jasmine.createSpyObj('container', [
        'addClass',
        'group',
        'prepend',
        'path'
      ]);
      this.node.container.group.and.returnValue('example group');

      this.renderDeferred = Q.defer();
      this.node.content = jasmine.createSpyObj('content', [
        'render',
        'transform',
        'getBBox'
      ]);
      this.node.content.getBBox.and.returnValue('content bbox');
      this.node.content.render.and.returnValue(this.renderDeferred.promise);

      this.node.repeat = {
        contentPosition: 'example position'
      };

      spyOn(this.node, 'skipPath').and.returnValue('skip path');
      spyOn(this.node, 'loopPath').and.returnValue('loop path');
      spyOn(this.node, 'loopLabel');
    });

    it('renders the content', function() {
      this.node._render();
      expect(this.node.content.render).toHaveBeenCalledWith('example group');
    });

    describe('positioning of content', function() {

      beforeEach(function() {
        this.renderDeferred.resolve();
      });

      it('moves the content to the correct position', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.content.transform).toHaveBeenCalledWith('example position');
          }, fail)
          .finally(done)
          .done();
      });

      it('renders a skip path and loop path', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.skipPath).toHaveBeenCalledWith('content bbox');
            expect(this.node.loopPath).toHaveBeenCalledWith('content bbox');
            expect(this.node.container.path).toHaveBeenCalledWith('skip pathloop path');
          }, fail)
          .finally(done)
          .done();
      });

      it('renders a loop label', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.loopLabel).toHaveBeenCalled();
          }, fail)
          .finally(done)
          .done();
      });

    });

  });

  describe('#skipPath', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a').__consume__match_fragment();

      this.node.repeat = {};

      this.box = {
        y: 11,
        ay: 22,
        width: 33
      };
    });

    it('returns nothing when there is no skip', function() {
      this.node.repeat.hasSkip = false;
      expect(this.node.skipPath(this.box)).toEqual([]);
    });

    it('returns a path when there is a skip', function() {
      this.node.repeat.hasSkip = true;
      this.node.repeat.greedy = true;
      expect(this.node.skipPath(this.box)).toEqual([
        'M0,22q10,0 10,-10v-1q0,-10 10,-10h23q10,0 10,10v1q0,10 10,10'
      ]);
    });

    it('returns a path with arrow when there is a non-greedy skip', function() {
      this.node.repeat.hasSkip = true;
      this.node.repeat.greedy = false;
      expect(this.node.skipPath(this.box)).toEqual([
        'M0,22q10,0 10,-10v-1q0,-10 10,-10h23q10,0 10,10v1q0,10 10,10',
        'M10,7l5,5m-5,-5l-5,5'
      ]);
    });


  });

  describe('#loopPath', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a').__consume__match_fragment();

      this.node.repeat = {};

      this.box = {
        x: 11,
        x2: 22,
        ay: 33,
        y2: 44,
        width: 55
      };
    });

    it('returns nothing when there is no loop', function() {
      this.node.repeat.hasLoop = false;
      expect(this.node.loopPath(this.box)).toEqual([]);
    });

    it('returns a path when there is a loop', function() {
      this.node.repeat.hasLoop = true;
      this.node.repeat.greedy = false;
      expect(this.node.loopPath(this.box)).toEqual([
        'M11,33q-10,0 -10,10v1q0,10 10,10h55q10,0 10,-10v-1q0,-10 -10,-10'
      ]);
    });

    it('returns a path with arrow when there is a greedy loop', function() {
      this.node.repeat.hasLoop = true;
      this.node.repeat.greedy = true;
      expect(this.node.loopPath(this.box)).toEqual([
        'M11,33q-10,0 -10,10v1q0,10 10,10h55q10,0 10,-10v-1q0,-10 -10,-10',
        'M32,48l5,-5m-5,5l-5,-5'
      ]);
    });

  });

  describe('#loopLabel', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a').__consume__match_fragment();

      this.node.repeat = {};

      this.node.container = jasmine.createSpyObj('container', [
        'addClass',
        'text'
      ]);

      this.text = jasmine.createSpyObj('text', [
        'addClass',
        'getBBox',
        'transform'
      ]);
      this.node.container.text.and.returnValue(this.text);
      this.text.addClass.and.returnValue(this.text);
      this.text.getBBox.and.returnValue({
        width: 11,
        height: 22
      });
      spyOn(this.node, 'getBBox').and.returnValue({
        x2: 33,
        y2: 44
      });
    });

    describe('when a label is defined', function() {

      beforeEach(function() {
        this.node.repeat.label = 'example label';
      });

      it('renders a text element', function() {
        this.node.loopLabel();
        expect(this.node.container.text).toHaveBeenCalledWith(0, 0, 'example label');
      });

      describe('when there is a skip loop', function() {

        beforeEach(function() {
          this.node.repeat.hasSkip = true;
        });

        it('positions the text element', function() {
          this.node.loopLabel();
          expect(this.text.transform).toHaveBeenCalledWith(Snap.matrix()
            .translate(17, 66));
        });

      });

      describe('when there is no skip loop', function() {

        beforeEach(function() {
          this.node.repeat.hasSkip = false;
        });

        it('positions the text element', function() {
          this.node.loopLabel();
          expect(this.text.transform).toHaveBeenCalledWith(Snap.matrix()
            .translate(22, 66));
        });

      });

    });

    describe('when a label is not defined', function() {

      it('does not render a text element', function() {
        this.node.loopLabel();
        expect(this.node.container.text).not.toHaveBeenCalled();
      });

    });

  });

});
