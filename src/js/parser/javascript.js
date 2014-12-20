import Q from 'q';

import javascript from './javascript/parser.js';

export default class Parser {
  constructor() {
    this.state = {
      groupCounter: 1,
      renderCounter: 0,
      maxCounter: 0,
      cancelRender: false
    };
  }

  parse(expression) {
    var deferred = Q.defer();

    setTimeout(() => {
      javascript.Parser.SyntaxNode.state = this.state;

      this.parsed = javascript.parse(expression.replace(/\n/g, '\\n'));
      deferred.resolve(this);
    });

    return deferred.promise;
  }

  render(svg, padding) {
    svg.selectAll('g').remove();

    return this.parsed.render(svg.group())
      .then(result => {
        var box = result.getBBox();

        result.transform(Snap.matrix()
          .translate(padding - box.x, padding - box.y));
        svg.attr({
          width: box.width + padding * 2,
          height: box.height + padding * 2
        });
      });
  }

  cancel() {
    this.state.cancelRender = true;
  }
}
