import parser from './javascript/grammar.peg';

import Root from './javascript/root.js';
import Regexp from './javascript/regexp.js';
import Match from './javascript/match.js';
import MatchFragment from './javascript/match_fragment.js';
import Subexp from './javascript/subexp.js';
import Charset from './javascript/charset.js';
import Terminal from './javascript/terminal.js';

parser.Parser.Root = Root;
parser.Parser.Regexp = Regexp;
parser.Parser.Match = Match;
parser.Parser.MatchFragment = MatchFragment;
parser.Parser.Subexp = Subexp;
parser.Parser.Charset = Charset;
parser.Parser.Terminal = Terminal;

export default parser;
