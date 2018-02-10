import javascript from '../../../src/js/parser/javascript/parser.js';
import Snap from 'snapsvg';
import _ from 'lodash';

describe('parser/javascript/root.js', function() {

  _.forIn({
    'test': {
      flags: [],
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '/test/': {
      flags: [],
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '/test/i': {
      flags: ['Ignore Case'],
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '/test/g': {
      flags: ['Global'],
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '/test/m': {
      flags: ['Multiline'],
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '/test/y': {
      flags: ['Sticky'],
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '/test/u': {
      flags: ['Unicode'],
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '/test/mgi': {
      flags: ['Global', 'Ignore Case', 'Multiline'],
      regexp: jasmine.objectContaining({ textValue: 'test' })
    }
  }, (content, str) => {
    it(`parses "${str}" as a Root`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__root()).toEqual(jasmine.objectContaining(content));
    });
  });

  describe('#_render', function() {

    beforeEach(function() {
      this.textElement = jasmine.createSpyObj('text', ['getBBox']);
      this.textElement.getBBox.and.returnValue({
        height: 20
      });

      this.node = new javascript.Parser('test').__consume__root();
      this.node.container = jasmine.createSpyObj('container', [
        'addClass',
        'text',
        'group',
        'path',
        'circle'
      ]);
      this.node.container.text.and.returnValue(this.textElement);
      this.node.container.group.and.returnValue('group element');

      this.node.regexp = jasmine.createSpyObj('regexp', [
        'render',
        'transform',
        'getBBox'
      ]);

      this.renderDeferred = this.testablePromise();
      this.node.regexp.render.and.returnValue(this.renderDeferred.promise);
    });

    it('renders the regexp', function() {
      this.node._render();
      expect(this.node.regexp.render).toHaveBeenCalledWith('group element');
    });

    describe('when there are flags', function() {

      beforeEach(function() {
        this.node.flags = ['example', 'flags'];
      });

      it('renders a text element', function() {
        this.node._render();
        expect(this.node.container.text).toHaveBeenCalledWith(0, 0, 'Flags: example, flags');
      });

    });

    describe('when there are no flags', function() {

      beforeEach(function() {
        this.node.flags = [];
      });

      it('does not render a text element', function() {
        this.node._render();
        expect(this.node.container.text).not.toHaveBeenCalled();
      });

    });

    describe('positioning of elements', function() {

      beforeEach(function() {
        this.renderDeferred.resolve();

        this.node.regexp.getBBox.and.returnValue({
          ax: 1,
          ay: 2,
          ax2: 3,
          x2: 4
        });
      });

      it('renders a path element to lead in and out of the regexp', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.container.path).toHaveBeenCalledWith('M1,2H0M3,2H14');
            done();
          });
      });

      it('renders circle elements before and after the regexp', function(done) {
        this.node._render()
          .then(() => {
            expect(this.node.container.circle).toHaveBeenCalledWith(0, 2, 5);
            expect(this.node.container.circle).toHaveBeenCalledWith(14, 2, 5);
            done();
          });
      });

      describe('when there are flags', function() {

        beforeEach(function() {
          this.node.flags = ['example'];
        });

        it('moves the regexp below the flag text', function(done) {
          this.node._render()
            .then(() => {
              expect(this.node.regexp.transform).toHaveBeenCalledWith(Snap.matrix()
                .translate(10, 20));
              done();
            });
        });

      });

      describe('when there are no flags', function() {

        beforeEach(function() {
          this.node.flags = [];
        });

        it('positions the regexp', function(done) {
          this.node._render()
            .then(() => {
              expect(this.node.regexp.transform).toHaveBeenCalledWith(Snap.matrix()
                .translate(10, 0));
              done();
            });
        });

      });

    });

  });

});
