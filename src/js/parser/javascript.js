import parser from './javascript/grammar.peg';

import Root from './javascript/root.js';
import Regexp from './javascript/regexp.js';
import Match from './javascript/match.js';
import MatchFragment from './javascript/match_fragment.js';
import Subexp from './javascript/subexp.js';
import Charset from './javascript/charset.js';
import Literal from './javascript/literal.js';
import Escape from './javascript/escape.js';
import AnyCharacter from './javascript/any_character.js';
import Repeat from './javascript/repeat.js';
import RepeatAny from './javascript/repeat_any.js';
import RepeatOptional from './javascript/repeat_optional.js';
import RepeatRequired from './javascript/repeat_required.js';
import RepeatSpec from './javascript/repeat_spec.js';

parser.Parser.Root = Root;
parser.Parser.Regexp = Regexp;
parser.Parser.Match = Match;
parser.Parser.MatchFragment = MatchFragment;
parser.Parser.Subexp = Subexp;
parser.Parser.Charset = Charset;
parser.Parser.Literal = Literal;
parser.Parser.Escape = Escape;
parser.Parser.AnyCharacter = AnyCharacter;
parser.Parser.Repeat = Repeat;
parser.Parser.RepeatAny = RepeatAny;
parser.Parser.RepeatOptional = RepeatOptional;
parser.Parser.RepeatRequired = RepeatRequired;
parser.Parser.RepeatSpec = RepeatSpec;

export default parser;
