import Snap from 'snapsvg';
import _ from 'lodash';

import javascript from './javascript/parser.js';
import ParserState from './javascript/parser_state.js';

export default class Parser {
  constructor(container, options) {
    this.options = options || {};
    _.defaults(this.options, {
      keepContent: false
    });

    this.container = container;

    this.state = new ParserState(this.container.querySelector('.progress div'));
  }

  set container(cont) {
    this._container = cont;
    this._container.innerHTML = [
      document.querySelector('#svg-container-base').innerHTML,
      this.options.keepContent ? this.container.innerHTML : ''
    ].join('');
    this._addClass('svg-container');
  }

  get container() {
    return this._container;
  }

  _addClass(className) {
    this.container.className = _(this.container.className.split(' '))
      .union([className])
      .value()
      .join(' ');
  }

  _removeClass(className) {
    this.container.className = _(this.container.className.split(' '))
      .without(className)
      .value()
      .join(' ');
  }

  parse(expression) {
    this._addClass('loading');

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          javascript.Parser.SyntaxNode.state = this.state;

          this.parsed = javascript.parse(expression.replace(/\n/g, '\\n'));
          resolve(this);
        }
        catch(e) {
          reject(e);
        }
      });
    });
  }

  render() {
    var svg = Snap(this.container.querySelector('svg'));

    return this.parsed.render(svg.group())
      .then(result => {
        var box = result.getBBox();

        result.transform(Snap.matrix()
          .translate(10 - box.x, 10 - box.y));
        svg.attr({
          width: box.width + 20,
          height: box.height + 20
        });
      })
      .then(() => {
        this._removeClass('loading');
        this.container.removeChild(this.container.querySelector('.progress'));
      });
  }

  cancel() {
    this.state.cancelRender = true;
  }

  get warnings() {
    return this.state.warnings;
  }
}
