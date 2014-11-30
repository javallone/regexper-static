import parser from './javascript/grammar.peg';

import Root from './javascript/root.js';
import Regexp from './javascript/regexp.js';
import Match from './javascript/match.js';

parser.Parser.Root = Root;
parser.Parser.Regexp = Regexp;
parser.Parser.Match = Match;

export default parser;
