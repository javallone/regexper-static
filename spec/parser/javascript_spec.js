import parser from 'src/js/parser/javascript.js';

describe('parser/javascript.peg', function() {

  describe('regular expression literals', function() {

    describe('flags support', function() {

      it('handles the ignore case flag', function() {
        expect(parser.parse('/test/i').flags().ignore_case).toEqual(true);
        expect(parser.parse('/test/').flags().ignore_case).toEqual(false);
      });

      it('handles the global flag', function() {
        expect(parser.parse('/test/g').flags().global).toEqual(true);
        expect(parser.parse('/test/').flags().global).toEqual(false);
      });

      it('handles the multiline flag', function() {
        expect(parser.parse('/test/m').flags().multiline).toEqual(true);
        expect(parser.parse('/test/').flags().multiline).toEqual(false);
      });

    });

  });

});
