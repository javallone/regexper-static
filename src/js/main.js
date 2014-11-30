import parser from './parser/javascript.js';
import Snap from 'snapsvg';

// Testing code
(function() {
  var result = parser.parse('test expr'),
      svg = Snap('#regexp-render svg'),
      container;

  if (svg) {
    container = svg.group();

    document.body.className = 'has-results';
    result.render(container);

    setTimeout(() => {
      var box;

      result.position();

      container.transform(Snap.matrix()
        .translate(10, 10));

      box = container.getBBox();
      svg.attr({
        width: box.width + 20,
        height: box.height + 20
      });
    });
  }
}());
