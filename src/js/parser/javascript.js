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

  render(containerElement, styles) {
    var svg,
        style = document.createElement('style');

    containerElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>';

    svg = Snap(containerElement.querySelector('svg'));

    style.setAttribute('type', 'text/css');
    if (style.styleSheet) {
      style.styleSheet.cssText = styles;
    } else {
      style.appendChild(document.createTextNode(styles));
    }

    svg.select('defs').append(style);

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
