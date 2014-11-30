import parser from './parser/javascript.js';
import Snap from 'snapsvg';

// Testing code
(function() {
  var result = parser.parse('test expr'),
      container = Snap('#regexp-render svg');

  if (container) {
    document.body.className = 'has-results';
    result.render(container);

    setTimeout(() => {
      result.position();
    });
  }
}());
