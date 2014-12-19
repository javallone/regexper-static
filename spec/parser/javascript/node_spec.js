import Node from 'src/js/parser/javascript/node.js';
import Q from 'q';
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
            get: function() { return 'value'; }
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

      it('returns anchor data from the bbox of the container merged _anchor of the node', function() {
        this.node._anchor = { example: 'value' };
        this.node.container = jasmine.createSpyObj('container', ['addClass', 'getBBox']);
        this.node.container.getBBox.and.returnValue({
          x: 'bbox x',
          x2: 'bbox x2',
          cy: 'bbox cy'
        });
        expect(this.node.anchor).toEqual({
          ax: 'bbox x',
          ax2: 'bbox x2',
          ay: 'bbox cy',
          example: 'value'
        });
      });

    });

  });

  describe('#getBBox', function() {

    it('returns the bbox of the container merged with the anchor', function() {
        this.node.proxy = {
          anchor: {
            anchor: 'example anchor'
          }
        };
        this.node.container = jasmine.createSpyObj('container', ['addClass', 'getBBox']);
        this.node.container.getBBox.and.returnValue({
          bbox: 'example bbox'
        });
        expect(this.node.getBBox()).toEqual({
          bbox: 'example bbox',
          anchor: 'example anchor'
        });
    });

  });

  describe('#normalizeBBox', function() {

    it('defaults the anchor keys to values from the bbox', function() {
      expect(this.node.normalizeBBox({
        x: 'bbox x',
        x2: 'bbox x2',
        cy: 'bbox cy',
        ay: 'bbox ay'
      })).toEqual({
        x: 'bbox x',
        x2: 'bbox x2',
        cy: 'bbox cy',
        ax: 'bbox x',
        ax2: 'bbox x2',
        ay: 'bbox ay'
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
        })
        .then(done);
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
        })
        .then(done);
    });

  });

  describe('#renderLabel', function() {

    pending();

  });

  describe('#startRender', function() {

    it('increments the renderCounter', function() {
      this.node.state.renderCounter = 0;
      this.node.startRender();
      expect(this.node.state.renderCounter).toEqual(1);
    });

  });

  describe('#doneRender', function() {

    pending();

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
        this.deferred = Q.defer();
        this.node._render = jasmine.createSpy('_render').and.returnValue(this.deferred.promise);
        spyOn(this.node, 'startRender');
        spyOn(this.node, 'doneRender');
      });

      it('sets the container', function() {
        this.node.render(this.container);
        expect(this.node.container).toEqual(this.container);
      });

      it('calls #startRender', function() {
        this.node.render(this.container);
        expect(this.node.startRender).toHaveBeenCalled();
      });

      it('calls #_render', function() {
        this.node.render(this.container);
        expect(this.node._render).toHaveBeenCalled();
      });

      describe('when #_render is complete', function() {

        beforeEach(function() {
          this.deferred.resolve();
        });

        it('calls #doneRender', function(done) {
          this.node.render(this.container)
            .then(() => {
              expect(this.node.doneRender).toHaveBeenCalled();
            })
            .then(done);
        });

        it('ultimately resolves with the node instance', function(done) {
          this.node.render(this.container)
            .then(result => {
              expect(result).toEqual(this.node);
            })
            .then(done);
        });

      });

    });

  });

  describe('#spaceHorizontally', function() {

    pending();

  });

  describe('#spaceVertically', function() {

    pending();

  });

  describe('#renderLabeledBox', function() {

    pending();

  });

});
