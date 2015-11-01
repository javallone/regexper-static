import Node from '../../../src/js/parser/javascript/node.js';
import Snap from 'snapsvg';

describe('parser/javascript/node.js', function() {

  beforeEach(function() {
    Node.state = {};
    this.node = new Node();
  });

  it('references the state from Node.state', function() {
    Node.state.example = 'example state';
    expect(this.node.state.example).toEqual('example state');
  });

  describe('module setter', function() {

    it('extends the node with the module', function() {
      this.node.module = { example: 'value' };
      expect(this.node.example).toEqual('value');
    });

    it('calls the module #setup method', function() {
      var setup = jasmine.createSpy('setup');
      this.node.module = { setup };
      expect(setup).toHaveBeenCalled();
    });

    it('sets up any defined properties', function() {
      this.node.module = {
        definedProperties: {
          example: {
            get: function() {
              return 'value';
            }
          }
        }
      };
      expect(this.node.example).toEqual('value');
    });

  });

  describe('container setter', function() {

    it('adds a class to the container element', function() {
      var container = jasmine.createSpyObj('container', ['addClass']);
      this.node.type = 'example type';
      this.node.container = container;
      expect(container.addClass).toHaveBeenCalledWith('example type');
    });

  });

  describe('anchor getter', function() {

    describe('when a proxy node is used', function() {

      it('returns the anchor from the proxy', function() {
        this.node.proxy = { anchor: 'example anchor' };
        expect(this.node.anchor).toEqual('example anchor');
      });

    });

    describe('when a proxy node is not used', function() {

      it('returns _anchor of the node', function() {
        this.node._anchor = { example: 'value' };
        expect(this.node.anchor).toEqual({
          example: 'value'
        });
      });

    });

  });

  describe('#getBBox', function() {

    it('returns the normalized bbox of the container merged with the anchor', function() {
      this.node.proxy = {
        anchor: {
          anchor: 'example anchor'
        }
      };
      this.node.container = jasmine.createSpyObj('container', ['addClass', 'getBBox']);
      this.node.container.getBBox.and.returnValue({
        bbox: 'example bbox',
        x: 'left',
        x2: 'right',
        cy: 'center'
      });
      expect(this.node.getBBox()).toEqual({
        bbox: 'example bbox',
        anchor: 'example anchor',
        x: 'left',
        x2: 'right',
        cy: 'center',
        ax: 'left',
        ax2: 'right',
        ay: 'center'
      });
    });

  });

  describe('#transform', function() {

    it('returns the result of calling transform on the container', function() {
      this.node.container = jasmine.createSpyObj('container', ['addClass', 'transform']);
      this.node.container.transform.and.returnValue('transform result');
      expect(this.node.transform('matrix')).toEqual('transform result');
      expect(this.node.container.transform).toHaveBeenCalledWith('matrix');
    });

  });

  describe('#deferredStep', function() {

    it('resolves the returned promise when the render is not canceled', function(done) {
      var resolve = jasmine.createSpy('resolve'),
          reject = jasmine.createSpy('reject');

      this.node.deferredStep('result')
        .then(resolve, reject)
        .then(() => {
          expect(resolve).toHaveBeenCalledWith('result');
          expect(reject).not.toHaveBeenCalled();
          done();
        });
    });

    it('rejects the returned promise when the render is canceled', function(done) {
      var resolve = jasmine.createSpy('resolve'),
          reject = jasmine.createSpy('reject');

      this.node.state.cancelRender = true;
      this.node.deferredStep('result', 'value')
        .then(resolve, reject)
        .then(() => {
          expect(resolve).not.toHaveBeenCalled();
          expect(reject).toHaveBeenCalledWith('Render cancelled');
          done();
        });
    });

  });

  describe('#renderLabel', function() {

    beforeEach(function() {
      this.group = jasmine.createSpyObj('group', ['addClass', 'rect', 'text']);
      this.group.addClass.and.returnValue(this.group);

      this.node.container = jasmine.createSpyObj('container', ['addClass', 'group']);
      this.node.container.group.and.returnValue(this.group);
    });

    it('adds a "label" class to the group', function() {
      this.node.renderLabel('example label');
      expect(this.group.addClass).toHaveBeenCalledWith('label');
    });

    it('creates a rect element', function() {
      this.node.renderLabel('example label');
      expect(this.group.rect).toHaveBeenCalled();
    });

    it('creates a text element', function() {
      this.node.renderLabel('example label');
      expect(this.group.text).toHaveBeenCalledWith(0, 0, ['example label']);
    });

    describe('positioning of label elements', function() {

      beforeEach(function() {
        this.text = jasmine.createSpyObj('text', ['getBBox', 'transform']);
        this.rect = jasmine.createSpyObj('rect', ['attr']);

        this.text.getBBox.and.returnValue({
          width: 42,
          height: 24
        });

        this.group.text.and.returnValue(this.text);
        this.group.rect.and.returnValue(this.rect);
      });

      it('transforms the text element', function(done) {
        this.node.renderLabel('example label')
          .then(() => {
            expect(this.text.transform).toHaveBeenCalledWith(Snap.matrix()
              .translate(5, 22));
            done();
          });
      });

      it('sets the dimensions of the rect element', function(done) {
        this.node.renderLabel('example label')
          .then(() => {
            expect(this.rect.attr).toHaveBeenCalledWith({
              width: 52,
              height: 34
            });
            done();
          });
      });

      it('resolves with the group element', function(done) {
        this.node.renderLabel('example label')
          .then(group => {
            expect(group).toEqual(this.group);
            done();
          });
      });

    });

  });

  describe('#render', function() {

    beforeEach(function() {
      this.container = jasmine.createSpyObj('container', ['addClass']);
    });

    describe('when a proxy node is used', function() {

      beforeEach(function() {
        this.node.proxy = jasmine.createSpyObj('proxy', ['render']);
        this.node.proxy.render.and.returnValue('example proxy result');
      });

      it('sets the container', function() {
        this.node.render(this.container);
        expect(this.node.container).toEqual(this.container);
      });

      it('calls the proxy render method', function() {
        expect(this.node.render(this.container)).toEqual('example proxy result');
        expect(this.node.proxy.render).toHaveBeenCalledWith(this.container);
      });

    });

    describe('when a proxy node is not used', function() {

      beforeEach(function() {
        this.deferred = this.testablePromise();
        this.node._render = jasmine.createSpy('_render').and.returnValue(this.deferred.promise);
      });

      it('sets the container', function() {
        this.node.render(this.container);
        expect(this.node.container).toEqual(this.container);
      });

      it('increments the renderCounter', function() {
        this.node.state.renderCounter = 0;
        this.node.render(this.container);
        expect(this.node.state.renderCounter).toEqual(1);
      });

      it('calls #_render', function() {
        this.node.render(this.container);
        expect(this.node._render).toHaveBeenCalled();
      });

      describe('when #_render is complete', function() {

        it('decrements the renderCounter', function(done) {
          this.node.render(this.container)
            .then(() => {
              expect(this.node.state.renderCounter).toEqual(41);
              done();
            });
          this.node.state.renderCounter = 42;
          this.deferred.resolve();
        });

        it('ultimately resolves with the node instance', function(done) {
          this.deferred.resolve();
          this.node.render(this.container)
            .then(result => {
              expect(result).toEqual(this.node);
              done();
            });
        });

      });

    });

  });

  describe('#renderLabeledBox', function() {

    beforeEach(function() {
      var svg = Snap(document.createElement('svg'));

      this.text = svg.text();
      this.rect = svg.rect();
      this.content = svg.rect();

      this.node.container = jasmine.createSpyObj('container', ['addClass', 'text', 'rect', 'prepend']);
      this.node.container.text.and.returnValue(this.text);
      this.node.container.rect.and.returnValue(this.rect);

      this.node.type = 'example-type';
    });

    it('creates a text element', function() {
      this.node.renderLabeledBox('example label', this.content, { padding: 5 });
      expect(this.node.container.text).toHaveBeenCalledWith(0, 0, ['example label']);
    });

    it('sets the class on the text element', function() {
      spyOn(this.text, 'addClass').and.callThrough();
      this.node.renderLabeledBox('example label', this.content, { padding: 5 });
      expect(this.text.addClass).toHaveBeenCalledWith('example-type-label');
    });

    it('creates a rect element', function() {
      this.node.renderLabeledBox('example label', this.content, { padding: 5 });
      expect(this.node.container.rect).toHaveBeenCalled();
    });

    it('sets the class on the rect element', function() {
      spyOn(this.rect, 'addClass').and.callThrough();
      this.node.renderLabeledBox('example label', this.content, { padding: 5 });
      expect(this.rect.addClass).toHaveBeenCalledWith('example-type-box');
    });

    it('sets the corner radius on the rect element', function() {
      spyOn(this.rect, 'attr').and.callThrough();
      this.node.renderLabeledBox('example label', this.content, { padding: 5 });
      expect(this.rect.attr).toHaveBeenCalledWith({
        rx: 3,
        ry: 3
      });
    });

    describe('positioning of elements', function() {

      beforeEach(function() {
        spyOn(this.text, 'getBBox').and.returnValue({
          width: 100,
          height: 20
        });
        spyOn(this.content, 'getBBox').and.returnValue({
          width: 200,
          height: 100,
          cx: 100
        });
      });

      it('positions the text element', function(done) {
        spyOn(this.text, 'transform').and.callThrough();
        this.node.renderLabeledBox('example label', this.content, { padding: 5 })
          .then(() => {
            expect(this.text.transform).toHaveBeenCalledWith(Snap.matrix()
              .translate(0, 20));
            done();
          });
      });

      it('positions the rect element', function(done) {
        spyOn(this.rect, 'transform').and.callThrough();
        this.node.renderLabeledBox('example label', this.content, { padding: 5 })
          .then(() => {
            expect(this.rect.transform).toHaveBeenCalledWith(Snap.matrix()
              .translate(0, 20));
            done();
          });
      });

      it('sets the dimensions of the rect element', function(done) {
        spyOn(this.rect, 'attr').and.callThrough();
        this.node.renderLabeledBox('example label', this.content, { padding: 5 })
          .then(() => {
            expect(this.rect.attr).toHaveBeenCalledWith({
              width: 210,
              height: 110
            });
            done();
          });
      });

      it('sets the dimensions of the rect element (based on the text element)', function(done) {
        this.content.getBBox.and.returnValue({
          width: 50,
          height: 100,
          cx: 25
        });
        spyOn(this.rect, 'attr').and.callThrough();
        this.node.renderLabeledBox('example label', this.content, { padding: 5 })
          .then(() => {
            expect(this.rect.attr).toHaveBeenCalledWith({
              width: 100,
              height: 110
            });
            done();
          });
      });

      it('positions the content element', function(done) {
        spyOn(this.content, 'transform').and.callThrough();
        this.node.renderLabeledBox('example label', this.content, { padding: 5 })
          .then(() => {
            expect(this.content.transform).toHaveBeenCalledWith(Snap.matrix()
              .translate(5, 25));
            done();
          });
      });

    });

  });

});
