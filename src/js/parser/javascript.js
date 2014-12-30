import Q from 'q';
import Snap from 'snapsvg';
import _ from 'lodash';

import javascript from './javascript/parser.js';

export default class Parser {
  constructor(container, options) {
    this.state = {
      groupCounter: 1,
      renderCounter: 0,
      maxCounter: 0,
      cancelRender: false,
      warnings: []
    };

    this.options = options || {};
    _.defaults(this.options, {
      keepContent: false
    });

    this.container = container;
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
    var deferred = Q.defer();

    this._addClass('loading');

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

  render() {
    var svg = Snap(this.container.querySelector('svg')),
        progress = this.container.querySelector('.progress div');

    return this.parsed.render(svg.group())
      .then(
        result => {
          var box = result.getBBox();

          result.transform(Snap.matrix()
            .translate(10 - box.x, 10 - box.y));
          svg.attr({
            width: box.width + 20,
            height: box.height + 20
          });
        },
        null,
        percent => {
          progress.style.width = percent * 100 + '%';
        }
      )
      .finally(() => {
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
