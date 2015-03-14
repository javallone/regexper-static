import javascript from 'src/js/parser/javascript/parser.js';
import util from 'src/js/util.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/match.js', function() {

  _.forIn({
    'example': {
      anchorStart: false,
      anchorEnd: false,
      parts: [
        jasmine.objectContaining({
          content: jasmine.objectContaining({ literal: 'example' })
        })
      ],
      proxy: jasmine.objectContaining({
        content: jasmine.objectContaining({ literal: 'example' })
      })
    },
    '^example': {
      anchorStart: true,
      anchorEnd: false,
      parts: [
        jasmine.objectContaining({
          content: jasmine.objectContaining({ literal: 'example' })
        })
      ],
    },
    'example$': {
      anchorStart: false,
      anchorEnd: true,
      parts: [
        jasmine.objectContaining({
          content: jasmine.objectContaining({ literal: 'example' })
        })
      ]
    },
    'example*': {
      anchorStart: false,
      anchorEnd: false,
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
      anchorStart: false,
      anchorEnd: false,
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

      this.node.anchorStart = true;
      this.node.anchorEnd = true;

      this.node.container = jasmine.createSpyObj('container', [
        'addClass',
        'group',
        'prepend',
        'path'
      ]);
      this.node.container.group.and.returnValue('example group');

      this.labelDeferreds = {
        'Start of line': this.testablePromise(),
        'End of line': this.testablePromise()
      };
      spyOn(this.node, 'renderLabel').and.callFake(label => {
        return this.labelDeferreds[label].promise;
      });

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

    describe('when there is no start anchor', function() {

      beforeEach(function() {
        this.node.anchorStart = false;
      });

      it('does not render a start anchor label', function() {
        this.node._render();
        expect(this.node.renderLabel).not.toHaveBeenCalledWith('Start of line');
      });

    });

    describe('when there is a start anchor', function() {

      beforeEach(function() {
        this.node.anchorStart = true;
      });

      it('renders a start anchor label', function() {
        this.node._render();
        expect(this.node.renderLabel).toHaveBeenCalledWith('Start of line');
      });

    });

    describe('when there is no end anchor', function() {

      beforeEach(function() {
        this.node.anchorEnd = false;
      });

      it('does not render an end anchor label', function() {
        this.node._render();
        expect(this.node.renderLabel).not.toHaveBeenCalledWith('End of line');
      });

    });

    describe('when there is an end anchor', function() {

      beforeEach(function() {
        this.node.anchorEnd = true;
      });

      it('renders an end anchor label', function() {
        this.node._render();
        expect(this.node.renderLabel).toHaveBeenCalledWith('End of line');
      });

    });

    it('renders each part', function() {
      this.node._render();
      expect(this.node.parts[0].render).toHaveBeenCalledWith('example group');
      expect(this.node.parts[1].render).toHaveBeenCalledWith('example group');
      expect(this.node.parts[2].render).toHaveBeenCalledWith('example group');
    });

    describe('positioning of items', function() {

      beforeEach(function() {
        this.startLabel = jasmine.createSpyObj('start', ['addClass']);
        this.startLabel.addClass.and.returnValue('start label');
        this.endLabel = jasmine.createSpyObj('end', ['addClass']);
        this.endLabel.addClass.and.returnValue('end label');
        this.labelDeferreds['Start of line'].resolve(this.startLabel);
        this.labelDeferreds['End of line'].resolve(this.endLabel);
        this.partDeferreds[0].resolve('part 0');
        this.partDeferreds[1].resolve('part 1');
        this.partDeferreds[2].resolve('part 2');

        spyOn(util, 'spaceHorizontally');
        spyOn(this.node, 'connectorPaths').and.returnValue(['connector paths']);
      });

      it('sets the start and end properties', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.start).toEqual('start label');
            expect(this.node.end).toEqual('end label');
            done();
          });
      });

      it('spaces the items horizontally', function(done) {
        this.node._render()
          .then(() => {
            expect(util.spaceHorizontally).toHaveBeenCalledWith([
              'start label',
              'part 0',
              'part 1',
              'part 2',
              'end label'
            ], { padding: 10 });
            done();
          });
      });

      it('renders the connector paths', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.connectorPaths).toHaveBeenCalledWith([
              'start label',
              'part 0',
              'part 1',
              'part 2',
              'end label'
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
