import javascript from '../../../src/js/parser/javascript/parser.js';
import util from '../../../src/js/util.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/match.js', function() {

  _.forIn({
    'example': {
      parts: [
        jasmine.objectContaining({
          content: jasmine.objectContaining({ literal: 'example' })
        })
      ],
      proxy: jasmine.objectContaining({
        content: jasmine.objectContaining({ literal: 'example' })
      })
    },
    'example*': {
      parts: [
        jasmine.objectContaining({
          content: jasmine.objectContaining({ literal: 'exampl' })
        }),
        jasmine.objectContaining({
          content: jasmine.objectContaining({ literal: 'e' })
        })
      ]
    },
    '': {
      parts: []
    }
  }, (content, str) => {
    it(`parses "${str}" as a Match`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__match()).toEqual(jasmine.objectContaining(content));
    });
  });

  describe('_anchor property', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a').__consume__match();

      this.node.start = jasmine.createSpyObj('start', ['getBBox']);
      this.node.start.getBBox.and.returnValue({
        x: 1,
        x2: 2,
        cy: 3
      });

      this.node.end = jasmine.createSpyObj('start', ['getBBox']);
      this.node.end.getBBox.and.returnValue({
        x: 4,
        x2: 5,
        cy: 6
      });

      spyOn(this.node, 'transform').and.returnValue({
        localMatrix: Snap.matrix().translate(10, 20)
      });
    });

    it('calculates the anchor from the start and end items', function() {
      expect(this.node._anchor).toEqual({
        ax: 11,
        ax2: 15,
        ay: 23
      });
    });

  });

  describe('#_render', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a').__consume__match();

      this.node.container = jasmine.createSpyObj('container', [
        'addClass',
        'group',
        'prepend',
        'path'
      ]);
      this.node.container.group.and.returnValue('example group');

      this.node.parts = [
        jasmine.createSpyObj('part 0', ['render']),
        jasmine.createSpyObj('part 1', ['render']),
        jasmine.createSpyObj('part 2', ['render'])
      ];

      this.partDeferreds = [
        this.testablePromise(),
        this.testablePromise(),
        this.testablePromise()
      ];

      this.node.parts[0].render.and.returnValue(this.partDeferreds[0].promise);
      this.node.parts[1].render.and.returnValue(this.partDeferreds[1].promise);
      this.node.parts[2].render.and.returnValue(this.partDeferreds[2].promise);
    });

    it('renders each part', function() {
      this.node._render();
      expect(this.node.parts[0].render).toHaveBeenCalledWith('example group');
      expect(this.node.parts[1].render).toHaveBeenCalledWith('example group');
      expect(this.node.parts[2].render).toHaveBeenCalledWith('example group');
    });

    describe('positioning of items', function() {

      beforeEach(function() {
        this.partDeferreds[0].resolve('part 0');
        this.partDeferreds[1].resolve('part 1');
        this.partDeferreds[2].resolve('part 2');

        spyOn(util, 'spaceHorizontally');
        spyOn(this.node, 'connectorPaths').and.returnValue(['connector paths']);
      });

      it('sets the start and end properties', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.start).toEqual('part 0');
            expect(this.node.end).toEqual('part 2');
            done();
          });
      });

      it('spaces the items horizontally', function(done) {
        this.node._render()
          .then(() => {
            expect(util.spaceHorizontally).toHaveBeenCalledWith([
              'part 0',
              'part 1',
              'part 2'
            ], { padding: 10 });
            done();
          });
      });

      it('renders the connector paths', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.connectorPaths).toHaveBeenCalledWith([
              'part 0',
              'part 1',
              'part 2'
            ]);
            expect(this.node.container.path).toHaveBeenCalledWith('connector paths');
            done();
          });
      });

    });

  });

  describe('#connectorPaths', function() {

    beforeEach(function() {
      this.node = new javascript.Parser('a').__consume__match();

      this.items = [
        jasmine.createSpyObj('item 0', ['getBBox']),
        jasmine.createSpyObj('item 1', ['getBBox']),
        jasmine.createSpyObj('item 2', ['getBBox'])
      ];

      this.items[0].getBBox.and.returnValue({
        x: 10,
        x2: 20,
        cy: 5
      });
      this.items[1].getBBox.and.returnValue({
        x: 30,
        x2: 40,
        cy: 5
      });
      this.items[2].getBBox.and.returnValue({
        x: 50,
        x2: 60,
        cy: 5
      });
    });

    it('returns the connector paths between fragments', function() {
      expect(this.node.connectorPaths(this.items)).toEqual([
        'M20,5H30',
        'M40,5H50'
      ]);
    });

  });

});
