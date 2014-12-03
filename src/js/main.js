import parser from './parser/javascript.js';
import Snap from 'snapsvg';

// Testing code
(function() {
  var result = parser.parse('^test?(foo)[a-z]asdf$'),
      svg = Snap('#regexp-render svg');

  if (svg) {
    document.body.className = 'has-results';

    result.container = svg.group().transform(Snap.matrix()
      .translate(10, 10));
    result.render();

    setTimeout(() => {
      var box;

      result.position();

      box = result.container.getBBox();
      svg.attr({
        width: box.width + 20,
        height: box.height + 20
      });
    });
  }
}());
