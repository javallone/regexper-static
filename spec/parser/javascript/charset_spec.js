import javascript from 'src/js/parser/javascript/parser.js';
import Node from 'src/js/parser/javascript/node.js';
import util from 'src/js/util.js';
import _ from 'lodash';
import Snap from 'snapsvg';
import Q from 'q';

describe('parser/javascript/charset.js', function() {

  _.forIn({
    '[abc]': {
      label: 'One of:',
      elements: [
        jasmine.objectContaining({ type: 'literal', textValue: 'a' }),
        jasmine.objectContaining({ type: 'literal', textValue: 'b' }),
        jasmine.objectContaining({ type: 'literal', textValue: 'c' })
      ]
    },
    '[^abc]': {
      label: 'None of:',
      elements: [
        jasmine.objectContaining({ type: 'literal', textValue: 'a' }),
        jasmine.objectContaining({ type: 'literal', textValue: 'b' }),
        jasmine.objectContaining({ type: 'literal', textValue: 'c' })
      ]
    },
    '[aaa]': {
      label: 'One of:',
      elements: [
        jasmine.objectContaining({ type: 'literal', textValue: 'a' })
      ]
    },
    '[a-z]': {
      label: 'One of:',
      elements: [
        jasmine.objectContaining({ type: 'charset-range', textValue: 'a-z' })
      ]
    },
    '[\\b]': {
      label: 'One of:',
      elements: [
        jasmine.objectContaining({ type: 'charset-escape', textValue: '\\b' })
      ]
    }

  }, (content, str) => {
    it(`parses "${str}" as a Charset`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__charset()).toEqual(jasmine.objectContaining(content));
    });
  });

  it('adds a warning for character sets the contain non-standard escapes', function() {
    var node;

    Node.state = { warnings: [] };
    node = new javascript.Parser('[\\c]').__consume__charset();
    expect(node.state.warnings).toEqual(['The character set "[\\c]" contains the \\c escape followed by a character other than A-Z. This can lead to different behavior depending on browser. The representation here is the most common interpretation.']);
  });

  describe('_anchor property', function() {

    it('calculates the anchor based on the partContainer', function() {
      var node = new javascript.Parser('[a]').__consume__charset();

      node.partContainer = jasmine.createSpyObj('partContainer', ['getBBox']);
      node.partContainer.getBBox.and.returnValue({
        cy: 20
      });

      node.container = jasmine.createSpyObj('container', ['addClass', 'getBBox']);
      node.container.getBBox.and.returnValue({
        x: 10,
        x2: 15
      });

      spyOn(node, 'transform').and.returnValue({
        localMatrix: Snap.matrix().translate(3, 8)
      });

      expect(node._anchor).toEqual({
        ax: 10,
        ax2: 15,
        ay: 28
      });
    });

  });

  describe('#_render', function() {

    beforeEach(function() {
      var counter = 0;

      this.node = new javascript.Parser('[a]').__consume__charset();
      this.node.label = 'example label';
      this.node.elements = [
        jasmine.createSpyObj('item', ['render']),
        jasmine.createSpyObj('item', ['render']),
        jasmine.createSpyObj('item', ['render'])
      ];
      this.elementDeferred = [
        Q.defer(),
        Q.defer(),
        Q.defer()
      ];
      this.node.elements[0].render.and.returnValue(this.elementDeferred[0].promise);
      this.node.elements[1].render.and.returnValue(this.elementDeferred[1].promise);
      this.node.elements[2].render.and.returnValue(this.elementDeferred[2].promise);

      this.node.container = Snap(document.createElement('svg'));
      this.partContainer = this.node.container.group();
      spyOn(this.node.container, 'group').and.returnValue(this.partContainer);
      spyOn(this.partContainer, 'group').and.callFake(function() {
        return `group ${counter++}`;
      });

      spyOn(this.node, 'renderLabeledBox').and.returnValue('labeled box promise');
      spyOn(util, 'spaceVertically');
    });

    it('creates a cotainer for the parts of the charset', function() {
      this.node._render();
      expect(this.node.partContainer).toEqual(this.partContainer);
    });

    it('renders each item', function() {
      this.node._render();
      expect(this.node.elements[0].render).toHaveBeenCalledWith('group 0');
      expect(this.node.elements[1].render).toHaveBeenCalledWith('group 1');
      expect(this.node.elements[2].render).toHaveBeenCalledWith('group 2');
    });

    describe('positioning of the items', function() {

      beforeEach(function() {
        this.elementDeferred[0].resolve();
        this.elementDeferred[1].resolve();
        this.elementDeferred[2].resolve();
      });

      it('spaces the elements vertically', function(done) {
        this.node._render()
          .then(() => {
            expect(util.spaceVertically).toHaveBeenCalledWith(this.node.elements, { padding: 5 });
          })
          .finally(done)
          .done();
      });

      it('renders a labeled box', function(done) {
        this.node._render()
          .then(result => {
            expect(this.node.renderLabeledBox).toHaveBeenCalledWith('example label', this.partContainer, { padding: 5 });
            expect(result).toEqual('labeled box promise');
          })
          .finally(done)
          .done();
      });

    });

  });

});
