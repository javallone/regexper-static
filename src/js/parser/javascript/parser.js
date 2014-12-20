import parser from './grammar.peg';

import Node from './node.js';
import Root from './root.js';
import Regexp from './regexp.js';
import Match from './match.js';
import MatchFragment from './match_fragment.js';
import Subexp from './subexp.js';
import Charset from './charset.js';
import CharsetEscape from './charset_escape.js';
import CharsetRange from './charset_range.js';
import Literal from './literal.js';
import Escape from './escape.js';
import AnyCharacter from './any_character.js';
import Repeat from './repeat.js';
import RepeatAny from './repeat_any.js';
import RepeatOptional from './repeat_optional.js';
import RepeatRequired from './repeat_required.js';
import RepeatSpec from './repeat_spec.js';

parser.Parser.SyntaxNode      = Node;
parser.Parser.Root            = { module: Root };
parser.Parser.Regexp          = { module: Regexp };
parser.Parser.Match           = { module: Match };
parser.Parser.MatchFragment   = { module: MatchFragment };
parser.Parser.Subexp          = { module: Subexp };
parser.Parser.Charset         = { module: Charset };
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

export default parser;
