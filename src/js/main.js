import util from './util.js';
import Regexper from './regexper.js';
import Parser from './parser/javascript.js';
import _ from 'lodash';

(function() {
  if (document.body.querySelector('#content .container')) {
    var regexper = new Regexper(document.body);

    regexper.bindListeners();

    setTimeout(() => {
      window.dispatchEvent(util.customEvent('hashchange'));
    });
  }

  _.each(document.querySelectorAll('svg[data-expr]'), element => {
    var parser = new Parser();

    parser.parse(element.getAttribute('data-expr'))
      .invoke('render', element, document.querySelector('#svg-styles').innerHTML)
      .done();
  });
}());
