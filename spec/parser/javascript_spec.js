import Parser from 'src/js/parser/javascript.js';
import regexpParser from 'src/js/parser/javascript/grammar.peg';
import Snap from 'snapsvg';
import Q from 'q';

describe('parser/javascript.js', function() {

  beforeEach(function() {
    this.parser = new Parser();
  });

  describe('#parser', function() {

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

  });

  describe('#render', function() {

    beforeEach(function() {
      this.renderPromise = Q.defer();
      this.parser.parsed = jasmine.createSpyObj('parsed', ['render']);
      this.parser.parsed.render.and.returnValue(this.renderPromise.promise);

      this.svg = Snap(document.createElement('svg'));
      spyOn(this.svg, 'group').and.returnValue('example group');
    });

    it('render the parsed expression', function() {
      this.parser.render(this.svg, 10);
      expect(this.parser.parsed.render).toHaveBeenCalledWith('example group');
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

        spyOn(this.svg, 'attr');

        this.parser.render(this.svg, 10);
        this.renderPromise.resolve(this.result);

        setTimeout(done, 10);
      });

      it('positions the renderd expression', function() {
        expect(this.result.transform).toHaveBeenCalledWith(Snap.matrix()
          .translate(6, 8));
      });

      it('sets the dimensions of the image', function() {
        expect(this.svg.attr).toHaveBeenCalledWith({
          width: 62,
          height: 44
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

});
