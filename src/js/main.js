import util from './util.js';
import Regexper from './regexper.js';
import Parser from './parser/javascript.js';
import _ from 'lodash';

window._gaq = (typeof _gaq !== 'undefined') ? _gaq : {
  push: console.debug.bind(console)
};

(function() {
  window.addEventListener('error', function(error) {
    if (error.lineno !== 0) {
      _gaq.push([
        '_trackEvent',
        'global',
        'exception',
        `${error.filename}(${error.lineno},${error.colno}): ${error.message}`
      ]);

      if (typeof error.error !== 'undefined' && typeof error.error.stack !== 'undefined') {
        _gaq.push([
          '_trackEvent',
          'global',
          'stack trace',
          error.error.stack
        ]);
      }
    }
  });

  if (document.body.querySelector('#content .application')) {
    var regexper = new Regexper(document.body);

    regexper.bindListeners();

    util.tick().then(() => {
      window.dispatchEvent(util.customEvent('hashchange'));
    });
  }

  _.each(document.querySelectorAll('[data-expr]'), element => {
    new Parser(element, { keepContent: true })
      .parse(element.getAttribute('data-expr'))
      .then(parser => {
        parser.render();
      })
      .catch(util.exposeError);
  });
}());
