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

  _.each(document.querySelectorAll('[data-expr]'), element => {
    new Parser(element, { keepContent: true })
      .parse(element.getAttribute('data-expr'))
      .invoke('render')
      .done();
  });
}());
