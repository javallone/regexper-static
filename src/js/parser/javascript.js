import Q from 'q';

import parser from './javascript/grammar.peg';

import Node from './javascript/node.js';
import Root from './javascript/root.js';
import Regexp from './javascript/regexp.js';
import Match from './javascript/match.js';
import MatchFragment from './javascript/match_fragment.js';
import Subexp from './javascript/subexp.js';
import Charset from './javascript/charset.js';
import CharsetLiteral from './javascript/charset_literal.js';
import CharsetEscape from './javascript/charset_escape.js';
import CharsetRange from './javascript/charset_range.js';
import Literal from './javascript/literal.js';
import Escape from './javascript/escape.js';
import AnyCharacter from './javascript/any_character.js';
import Repeat from './javascript/repeat.js';
import RepeatAny from './javascript/repeat_any.js';
import RepeatOptional from './javascript/repeat_optional.js';
import RepeatRequired from './javascript/repeat_required.js';
import RepeatSpec from './javascript/repeat_spec.js';

parser.Parser.SyntaxNode      = Node;
parser.Parser.Root            = { module: Root };
parser.Parser.Regexp          = { module: Regexp };
parser.Parser.Match           = { module: Match };
parser.Parser.MatchFragment   = { module: MatchFragment };
parser.Parser.Subexp          = { module: Subexp };
parser.Parser.Charset         = { module: Charset };
parser.Parser.CharsetLiteral  = { module: CharsetLiteral };
parser.Parser.CharsetEscape   = { module: CharsetEscape };
parser.Parser.CharsetRange    = { module: CharsetRange };
parser.Parser.Literal         = { module: Literal };
parser.Parser.Escape          = { module: Escape };
parser.Parser.AnyCharacter    = { module: AnyCharacter };
parser.Parser.Repeat          = { module: Repeat };
parser.Parser.RepeatAny       = { module: RepeatAny };
parser.Parser.RepeatOptional  = { module: RepeatOptional };
parser.Parser.RepeatRequired  = { module: RepeatRequired };
parser.Parser.RepeatSpec      = { module: RepeatSpec };

export default class Parser {
  constructor() {
    this.state = {
      groupCounter: 1,
      renderCounter: 0,
      maxCounter: 0,
      cancelRender: false
    };
  }

  parse(expression) {
    var deferred = Q.defer();

    setTimeout(() => {
      Node.state = this.state;

      this.parsed = parser.parse(expression.replace(/\n/g, '\\n'));
      deferred.resolve(this);
    });

    return deferred.promise;
  }

  render(svg, padding) {
    svg.selectAll('g').remove();

    return this.parsed.render(svg.group())
      .then(result => {
        var box = result.getBBox();

        result.transform(Snap.matrix()
          .translate(padding - box.x, padding - box.y));
        svg.attr({
          width: box.width + padding * 2,
          height: box.height + padding * 2
        });
      });
  }

  cancel() {
    this.state.cancelRender = true;
  }
}
