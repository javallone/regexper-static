import util from './util.js';
import Regexper from './regexper.js';
import Parser from './parser/javascript.js';
import _ from 'lodash';

(function() {
  if (document.body.querySelector('#content .application')) {
    var regexper = new Regexper(document.body);

    regexper.bindListeners();

    setTimeout(() => {
      window.dispatchEvent(util.customEvent('hashchange'));
    });
  }

  _.each(document.querySelectorAll('figure[data-expr]'), element => {
    var parser = new Parser(),
        svg;

    element.className = _.compact([element.className, 'loading']).join(' ');
    element.innerHTML = [
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>',
      '<div class="spinner">',
        '<div></div>',
        '<div></div>',
      '</div>',
      element.innerHTML
    ].join('');

    svg = element.querySelector('svg');

    setTimeout(() => {
      parser.parse(element.getAttribute('data-expr'))
        .invoke('render', svg, document.querySelector('#svg-styles').innerHTML)
        .finally(() => {
          element.className = _.without(element.className.split(' '), 'loading').join(' ');
          element.removeChild(element.querySelector('.spinner'));
        })
        .done();
    }, 1);
  });
}());
