import Regexper from './regexper.js';

(function() {
  var regexper = new Regexper(document.body);
  regexper.bindListeners();

  setTimeout(() => {
    var evt = document.createEvent('Event');

    evt.initEvent('hashchange', true, true);
    window.dispatchEvent(evt);
  });
}());
