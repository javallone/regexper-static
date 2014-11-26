import parser from './javascript/grammar.peg';

import Root from './javascript/root.js';
import Regexp from './javascript/regexp.js';

parser.Parser.Root = Root;
parser.Parser.Regexp = Regexp;

export default parser;
