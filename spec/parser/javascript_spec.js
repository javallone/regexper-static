import Parser from 'src/js/parser/javascript.js';
import regexpParser from 'src/js/parser/javascript/grammar.peg';
import Snap from 'snapsvg';
import Q from 'q';

describe('parser/javascript.js', function() {

  beforeEach(function() {
    this.parser = new Parser();
  });

  describe('#parse', function() {

    beforeEach(function() {
      spyOn(regexpParser, 'parse');
    });

    it('parses the expression', function(done) {
      this.parser.parse('example expression')
        .then(() => {
          expect(regexpParser.parse).toHaveBeenCalledWith('example expression');
        })
        .finally(done)
        .done();
    });

    it('replaces newlines with "\\n"', function(done) {
      this.parser.parse('multiline\nexpression')
        .then(() => {
          expect(regexpParser.parse).toHaveBeenCalledWith('multiline\\nexpression');
        })
        .finally(done)
        .done();
    });

    it('resolves the returned promise with the parser instance', function(done) {
      this.parser.parse('example expression')
        .then(result => {
          expect(result).toEqual(this.parser);
        })
        .finally(done)
        .done();
    });

    it('rejects the returned promise with the exception thrown', function(done) {
      this.parser.parse('/example')
        .then(null, result => {
          expect(result).toBeDefined();
        })
        .finally(done)
        .done();
    });

  });

  describe('#render', function() {

    beforeEach(function() {
      this.renderPromise = Q.defer();
      this.parser.parsed = jasmine.createSpyObj('parsed', ['render']);
      this.parser.parsed.render.and.returnValue(this.renderPromise.promise);

      this.svgBase = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"></svt>';
      this.svgContainer = document.createElement('div');
    });

    it('creates the SVG element', function() {
      var svg;

      this.parser.render(this.svgContainer, this.svgBase);

      svg = this.svgContainer.querySelector('svg');
      expect(svg.getAttribute('xmlns')).toEqual('http://www.w3.org/2000/svg');
      expect(svg.getAttribute('version')).toEqual('1.1');
    });

    it('render the parsed expression', function() {
      this.parser.render(this.svgContainer, this.svgBase);
      expect(this.parser.parsed.render).toHaveBeenCalled();
    });

    describe('when rendering is complete', function() {

      beforeEach(function(done) {
        this.result = jasmine.createSpyObj('result', ['getBBox', 'transform']);
        this.result.getBBox.and.returnValue({
          x: 4,
          y: 2,
          width: 42,
          height: 24
        });

        this.parser.render(this.svgContainer, this.svgBase);
        this.renderPromise.resolve(this.result);

        setTimeout(done, 10);
      });

      it('positions the renderd expression', function() {
        expect(this.result.transform).toHaveBeenCalledWith(Snap.matrix()
          .translate(6, 8));
      });

      it('sets the dimensions of the image', function() {
        var svg = this.svgContainer.querySelector('svg');

        expect(svg.getAttribute('width')).toEqual('62');
        expect(svg.getAttribute('height')).toEqual('44');
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
