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

(function() {
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
