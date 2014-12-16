import Regexper from './regexper.js';

(function() {
  var regexper = new Regexper(document.body);

  if (document.body.querySelector('#content')) {
    regexper.bindListeners();

    setTimeout(() => {
      var evt = document.createEvent('Event');

      evt.initEvent('hashchange', true, true);
      window.dispatchEvent(evt);
    });
  }
}());
