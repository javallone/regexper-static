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
        .finally(done)
        .done();
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
        .finally(done)
        .done();
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
          })
          .finally(done)
          .done();
      });

      it('sets the dimensions of the rect element', function(done) {
        this.node.renderLabel('example label')
          .then(() => {
            expect(this.rect.attr).toHaveBeenCalledWith({
              width: 52,
              height: 34
            });
          })
          .finally(done)
          .done();
      });

      it('resolves with the group element', function(done) {
        this.node.renderLabel('example label')
          .then(group => {
            expect(group).toEqual(this.group);
          })
          .finally(done)
          .done();
      });

    });

  });

  describe('#startRender', function() {

    it('increments the renderCounter', function() {
      this.node.state.renderCounter = 0;
      this.node.startRender();
      expect(this.node.state.renderCounter).toEqual(1);
    });

  });

  describe('#doneRender', function() {

    it('sets the maxCounter when the maxCounter is initially 0', function() {
      this.node.state.renderCounter = 42;
      this.node.state.maxCounter = 0;
      this.node.doneRender();
      expect(this.node.state.maxCounter).toEqual(42);
      this.node.state.renderCounter = 24;
      this.node.doneRender();
      expect(this.node.state.maxCounter).toEqual(42);
    });

    it('decrements the renderCounter', function() {
      this.node.state.renderCounter = 42;
      this.node.doneRender();
      expect(this.node.state.renderCounter).toEqual(41);
    });

    it('triggers an updateStatus event', function() {
      var evt;

      this.node.state.renderCounter = 117;
      this.node.state.maxCounter = 200;
      spyOn(document.body, 'dispatchEvent');
      this.node.doneRender();
      expect(document.body.dispatchEvent).toHaveBeenCalled();

      evt = document.body.dispatchEvent.calls.mostRecent().args[0];
      expect(evt.type).toEqual('updateStatus');
      expect(evt.detail).toEqual({ percentage: 0.42 });
    });

    it('returns a deferredStep', function() {
      spyOn(this.node, 'deferredStep').and.returnValue('example deferred');
      expect(this.node.doneRender()).toEqual('example deferred');
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
            .finally(done)
            .done();
        });

        it('ultimately resolves with the node instance', function(done) {
          this.node.render(this.container)
            .then(result => {
              expect(result).toEqual(this.node);
            })
            .finally(done)
            .done();
        });

      });

    });

  });

  describe('#spaceHorizontally', function() {

    it('positions each item', function() {
      var svg = Snap(document.createElement('svg')),
          items = [
            svg.group(),
            svg.group(),
            svg.group()
          ];

      spyOn(items[0], 'getBBox').and.returnValue({ ay: 5, width: 10 });
      spyOn(items[1], 'getBBox').and.returnValue({ ay: 15, width: 30 });
      spyOn(items[2], 'getBBox').and.returnValue({ ay: 10, width: 20 });
      spyOn(items[0], 'transform').and.callThrough();
      spyOn(items[1], 'transform').and.callThrough();
      spyOn(items[2], 'transform').and.callThrough();

      this.node.spaceHorizontally(items, { padding: 5 });

      expect(items[0].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(0, 10));
      expect(items[1].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(15, 0));
      expect(items[2].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(50, 5));
    });

  });

  describe('#spaceVertically', function() {

    it('positions each item', function() {
      var svg = Snap(document.createElement('svg')),
          items = [
            svg.group(),
            svg.group(),
            svg.group()
          ];

      spyOn(items[0], 'getBBox').and.returnValue({ cx: 5, height: 10 });
      spyOn(items[1], 'getBBox').and.returnValue({ cx: 15, height: 30 });
      spyOn(items[2], 'getBBox').and.returnValue({ cx: 10, height: 20 });
      spyOn(items[0], 'transform').and.callThrough();
      spyOn(items[1], 'transform').and.callThrough();
      spyOn(items[2], 'transform').and.callThrough();

      this.node.spaceVertically(items, { padding: 5 });

      expect(items[0].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(10, 0));
      expect(items[1].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(0, 15));
      expect(items[2].transform).toHaveBeenCalledWith(Snap.matrix()
        .translate(5, 50));
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
      expect(this.node.container.text).toHaveBeenCalledWith(0, 0, 'example label');
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
          })
          .finally(done)
          .done();
      });

      it('positions the rect element', function(done) {
        spyOn(this.rect, 'transform').and.callThrough();
        this.node.renderLabeledBox('example label', this.content, { padding: 5 })
          .then(() => {
            expect(this.rect.transform).toHaveBeenCalledWith(Snap.matrix()
              .translate(0, 20));
          })
          .finally(done)
          .done();
      });

      it('sets the dimensions of the rect element', function(done) {
        spyOn(this.rect, 'attr').and.callThrough();
        this.node.renderLabeledBox('example label', this.content, { padding: 5 })
          .then(() => {
            expect(this.rect.attr).toHaveBeenCalledWith({
              width: 210,
              height: 110
            })
          })
          .finally(done)
          .done();
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
            })
          })
          .finally(done)
          .done();
      });

      it('positions the content element', function(done) {
        spyOn(this.content, 'transform').and.callThrough();
        this.node.renderLabeledBox('example label', this.content, { padding: 5 })
          .then(() => {
            expect(this.content.transform).toHaveBeenCalledWith(Snap.matrix()
              .translate(5, 25));
          })
          .finally(done)
          .done();
      });

    });

  });

});
