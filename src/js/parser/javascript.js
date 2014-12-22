import Q from 'q';
import Snap from 'snapsvg';

import javascript from './javascript/parser.js';

export default class Parser {
  constructor() {
    this.state = {
      groupCounter: 1,
      renderCounter: 0,
      maxCounter: 0,
      cancelRender: false,
      warnings: []
    };
  }

  parse(expression) {
    var deferred = Q.defer();

    setTimeout(() => {
      try {
        javascript.Parser.SyntaxNode.state = this.state;

        this.parsed = javascript.parse(expression.replace(/\n/g, '\\n'));
        deferred.resolve(this);
      }
      catch(e) {
        deferred.reject(e);
      }
    });

    return deferred.promise;
  }

  render(svgElement, styles) {
    var svg;

    svgElement.innerHTML = [
      '<style type="text/css">',
      styles,
      '</style>'
    ].join('');

    svg = Snap(svgElement);

    return this.parsed.render(svg.group())
      .then(result => {
        var box = result.getBBox();

        result.transform(Snap.matrix()
          .translate(10 - box.x, 10 - box.y));
        svg.attr({
          width: box.width + 20,
          height: box.height + 20
        });
      });
  }

  cancel() {
    this.state.cancelRender = true;
  }

  get warnings() {
    return this.state.warnings;
  }
}
