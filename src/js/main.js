import util from './util.js';
import Regexper from './regexper.js';
import Parser from './parser/javascript.js';
import _ from 'lodash';

window._gaq = (typeof _gaq !== 'undefined') ? _gaq : {
  push: console.debug.bind(console)
};

(function() {
  window.addEventListener('error', function(error) {
    _gaq.push([
      '_trackEvent',
      'global',
      'exception',
      `${error.filename}(${error.lineno}): ${error.message}`
    ]);
  });

  if (document.body.querySelector('#content .application')) {
    var regexper = new Regexper(document.body);

    regexper.bindListeners();

    setTimeout(() => {
      window.dispatchEvent(util.customEvent('hashchange'));
    });
  }

  _.each(document.querySelectorAll('figure[data-expr]'), element => {
    var parser = new Parser(),
        svg, percentage;

    element.className = _.compact([element.className, 'loading']).join(' ');
    element.innerHTML = [
      '<div class="svg"></div>',
      '<div class="spinner">',
        '<div></div>',
        '<div></div>',
      '</div>',
      '<div class="progress"><div style="width: 0;"></div></div>',
      element.innerHTML
    ].join('');

    svg = element.querySelector('.svg');
    percentage = element.querySelector('.progress div');

    setTimeout(() => {
      parser.parse(element.getAttribute('data-expr'))
        .invoke('render', svg, document.querySelector('#svg-base').innerHTML)
        .then(null, null, progress => {
          percentage.style.width = progress * 100 + '%';
        })
        .finally(() => {
          element.className = _.without(element.className.split(' '), 'loading').join(' ');
          element.removeChild(element.querySelector('.spinner'));
          element.removeChild(element.querySelector('.progress'));
        })
        .done();
    }, 1);
  });
}());
