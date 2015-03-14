import Parser from 'src/js/parser/javascript.js';
import regexpParser from 'src/js/parser/javascript/grammar.peg';
import Snap from 'snapsvg';

describe('parser/javascript.js', function() {

  beforeEach(function() {
    this.container = document.createElement('div');
    this.parser = new Parser(this.container);
  });

  describe('container property', function() {

    it('sets the content of the element', function() {
      var element = document.createElement('div');
      this.parser.container = element;

      expect(element.innerHTML).not.toEqual('');
    });

    it('keeps the original content if the keepContent option is set', function() {
      var element = document.createElement('div');
      element.innerHTML = 'example content';

      this.parser.options.keepContent = true;
      this.parser.container = element;

      expect(element.innerHTML).toContain('example content');
      expect(element.innerHTML).not.toEqual('example content');
    });

    it('adds the "svg-container" class', function() {
      spyOn(this.parser, '_addClass');
      this.parser.container = document.createElement('div');
      expect(this.parser._addClass).toHaveBeenCalledWith('svg-container');
    });

  });

  describe('#parse', function() {

    beforeEach(function() {
      spyOn(regexpParser, 'parse');
    });

    it('adds the "loading" class', function() {
      spyOn(this.parser, '_addClass');
      this.parser.parse('example expression');
      expect(this.parser._addClass).toHaveBeenCalledWith('loading');
    });

    it('parses the expression', function(done) {
      this.parser.parse('example expression')
        .then(() => {
          expect(regexpParser.parse).toHaveBeenCalledWith('example expression');
          done();
        });
    });

    it('replaces newlines with "\\n"', function(done) {
      this.parser.parse('multiline\nexpression')
        .then(() => {
          expect(regexpParser.parse).toHaveBeenCalledWith('multiline\\nexpression');
          done();
        });
    });

    it('resolves the returned promise with the parser instance', function(done) {
      this.parser.parse('example expression')
        .then(result => {
          expect(result).toEqual(this.parser);
          done();
        });
    });

    it('rejects the returned promise with the exception thrown', function(done) {
      regexpParser.parse.and.throwError('fail');
      this.parser.parse('(example')
        .then(null, result => {
          expect(result).toBeDefined();
          done();
        });
    });

  });

  describe('#render', function() {

    beforeEach(function() {
      this.renderPromise = this.testablePromise();
      this.parser.parsed = jasmine.createSpyObj('parsed', ['render']);
      this.parser.parsed.render.and.returnValue(this.renderPromise.promise);
    });

    it('render the parsed expression', function() {
      this.parser.render();
      expect(this.parser.parsed.render).toHaveBeenCalled();
    });

    describe('when rendering is complete', function() {

      beforeEach(function() {
        this.result = jasmine.createSpyObj('result', ['getBBox', 'transform']);
        this.result.getBBox.and.returnValue({
          x: 4,
          y: 2,
          width: 42,
          height: 24
        });

        this.renderPromise.resolve(this.result);
      });

      it('positions the renderd expression', function(done) {
        this.parser.render()
          .then(() => {
            expect(this.result.transform).toHaveBeenCalledWith(Snap.matrix()
              .translate(6, 8));
            done();
          });
      });

      it('sets the dimensions of the image', function(done) {
        this.parser.render()
          .then(() => {
            var svg = this.container.querySelector('svg');

            expect(svg.getAttribute('width')).toEqual('62');
            expect(svg.getAttribute('height')).toEqual('44');
            done();
          });
      });

      it('removes the "loading" class', function(done) {
        spyOn(this.parser, '_removeClass');
        this.parser.render()
          .then(() => {
            expect(this.parser._removeClass).toHaveBeenCalledWith('loading');
            done();
          });
      });

      it('removes the progress element', function(done) {
        this.parser.render()
          .then(() => {
            expect(this.container.querySelector('.loading')).toBeNull();
            done();
          });
      });

    });

  });

  describe('#cancel', function() {

    it('sets the cancelRender state to true', function() {
      this.parser.cancel();
      expect(this.parser.state.cancelRender).toEqual(true);
    });

  });

  describe('warnings property', function() {

    it('returns the content of the warnings state variable', function() {
      this.parser.state.warnings.push('example');
      expect(this.parser.warnings).toEqual(['example']);
    });

  });

});
