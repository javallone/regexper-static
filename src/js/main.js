import parser from './parser/javascript.js';
import Snap from 'snapsvg';

// Testing code
(function() {
  var result = parser.parse('^test?(foo)[a-z]asdf$'),
      svg = Snap('#regexp-render svg'),
      container;

  if (svg) {
    container = svg.group().transform(Snap.matrix()
      .translate(10, 10));


    document.body.className = 'has-results';
    result.render(container);

    setTimeout(() => {
      var box;

      result.position();

      box = container.getBBox();
      svg.attr({
        width: box.width + 20,
        height: box.height + 20
      });
    });
  }
}());
