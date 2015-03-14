import ParserState from 'src/js/parser/javascript/parser_state.js';

describe('parser/javascript/parser_state.js', function() {

  beforeEach(function() {
    this.progress = { style: {} };
    this.state = new ParserState(this.progress);
  });

  describe('renderCounter property', function() {

    it('sets the width of the progress element to the percent of completed steps', function() {
      this.state.renderCounter = 50;
      expect(this.progress.style.width).toEqual('0.00%');
      this.state.renderCounter = 10;
      expect(this.progress.style.width).toEqual('80.00%');
    });

    it('does not change the width of the progress element when rendering has been cancelled', function() {
      this.state.renderCounter = 50;
      this.state.renderCounter = 40;
      expect(this.progress.style.width).toEqual('20.00%');
      this.state.cancelRender = true;
      this.state.renderCounter = 10;
      expect(this.progress.style.width).toEqual('20.00%');
    });

  });

});
