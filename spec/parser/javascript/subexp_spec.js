import javascript from 'src/js/parser/javascript/parser.js';
import Node from 'src/js/parser/javascript/node.js';
import _ from 'lodash';
import Snap from 'snapsvg';

describe('parser/javascript/subexp.js', function() {

  beforeEach(function() {
    Node.state = { groupCounter: 1 };
  });

  _.forIn({
    '(test)': {
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '(?=test)': {
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '(?!test)': {
      regexp: jasmine.objectContaining({ textValue: 'test' })
    },
    '(?:test)': {
      regexp: jasmine.objectContaining({ textValue: 'test' }),
      proxy: jasmine.objectContaining({ textValue: 'test' })
    }
  }, (content, str) => {
    it(`parses "${str}" as a Subexp`, function() {
      var parser = new javascript.Parser(str);
      expect(parser.__consume__subexp()).toEqual(jasmine.objectContaining(content));
    });
  });

  describe('_anchor property', function() {

    it('applies the local transform matrix to the anchor from the regexp', function() {
      var node = new javascript.Parser('(test)').__consume__subexp();

      node.regexp = {
        getBBox() {
          return {
            ax: 10,
            ax2: 15,
            ay: 20
          };
        }
      };

      spyOn(node, 'transform').and.returnValue({
        localMatrix: Snap.matrix().translate(3, 8)
      });

      expect(node._anchor).toEqual({
        ax: 13,
        ax2: 18,
        ay: 28
      });
    });

  });

  describe('#_render', function() {

    beforeEach(function() {
      this.renderDeferred = this.testablePromise();

      this.node = new javascript.Parser('(test)').__consume__subexp();
      this.node.regexp = jasmine.createSpyObj('regexp', ['render']);
      this.node.container = jasmine.createSpyObj('container', ['addClass', 'group']);
      spyOn(this.node, 'label').and.returnValue('example label')

      this.node.regexp.render.and.returnValue(this.renderDeferred.promise);
    });

    it('renders the regexp', function() {
      this.node._render();
      expect(this.node.regexp.render).toHaveBeenCalled();
    });

    it('renders a labeled box', function(done) {
      spyOn(this.node, 'renderLabeledBox');
      this.renderDeferred.resolve();
      this.node._render()
        .then(() => {
          expect(this.node.renderLabeledBox).toHaveBeenCalledWith('example label', this.node.regexp, { padding: 10 });
          done();
        });
    });

  });

  describe('#label', function() {

    _.forIn({
      '(test)': {
        label: 'group #1',
        groupCounter: 2
      },
      '(?=test)': {
        label: 'positive lookahead',
        groupCounter: 1
      },
      '(?!test)': {
        label: 'negative lookahead',
        groupCounter: 1
      },
      '(?:test)': {
        label: '',
        groupCounter: 1
      }
    }, (data, str) => {
      it(`generates the correct label for "${str}"`, function() {
        var node = new javascript.Parser(str).__consume__subexp();
        expect(node.label()).toEqual(data.label);
        expect(node.state.groupCounter).toEqual(data.groupCounter);
      });
    });

  });

});
