import { customEvent } from './util.js';
import Regexper from './regexper.js';

(function() {
  var regexper = new Regexper(document.body);

  if (document.body.querySelector('#content')) {
    regexper.bindListeners();

    setTimeout(() => {
      window.dispatchEvent(customEvent('hashchange'));
    });
  }
}());
