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
        .translate(5, 5));

      box = container.getBBox();
      svg.attr({
        width: box.width + 10,
        height: box.height + 10
      });

      svg.rect().attr({
        'class': 'bounding-box',
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height
      });
    });
  }
}());
