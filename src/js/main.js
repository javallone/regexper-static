import Regexper from './regexper.js';

(function() {
  var regexper = new Regexper(document.body);
  regexper.bindListeners();

  setTimeout(() => {
    window.dispatchEvent(new Event('hashchange'));
  });
}());
