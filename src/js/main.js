// This file contains code to start up pages on the site, and other code that
// is not directly related to parsing and display of regular expressions.
//
// Since the code in this is executed immediately, it is all but impossible to
// test. Therefore, this code is kept as simple as possible to reduce the need
// to run it through automated tests.

import util from './util.js';
import Regexper from './regexper.js';
import Parser from './parser/javascript.js';
import _ from 'lodash';

// Add a dummy version of `_gaq` (the Google Analytics global object). This
// dummy object will log out tracking commands that would otherwise be sent to
// Google Analytics.
window._gaq = (typeof _gaq !== 'undefined') ? _gaq : {
  push: console.debug.bind(console)
};

(function() {
  // Global error handler that will send unhandled JavaScript exceptions and
  // stack-traces to Google Analytics. This data can be used to find errors in
  // code that were not found during testing.
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

  // Initialize the main page of the site. Functionality is kept in the
  // [Regexper class](./regexper.html).
  if (document.body.querySelector('#content .application')) {
    let regexper = new Regexper(document.body);

    regexper.detectBuggyHash();
    regexper.bindListeners();

    util.tick().then(() => {
      window.dispatchEvent(util.customEvent('hashchange'));
    });
  }

  // Initialize other pages on the site (specifically the documentation page).
  // Any element with a `data-expr` attribute will contain a rendering of the
  // provided regular expression.
  _.each(document.querySelectorAll('[data-expr]'), element => {
    new Parser(element, { keepContent: true })
      .parse(element.getAttribute('data-expr'))
      .then(parser => {
        parser.render();
      })
      .catch(util.exposeError);
  });
}());
