import { customEvent } from './util.js';
import Parser from './parser/javascript.js';
import Snap from 'snapsvg';
import Q from 'q';

export default class Regexper {
  constructor(root) {
    this.root = root;
    this.form = root.querySelector('#regexp-form');
    this.field = root.querySelector('#regexp-input');
    this.error = root.querySelector('#error');
    this.permalink = root.querySelector('a[data-glyph="link-intact"]');
    this.download = root.querySelector('a[data-glyph="data-transfer-download"]');
    this.percentage = root.querySelector('#progress div');
    this.svg = root.querySelector('#regexp-render svg');

    this.padding = 10;
    this.snap = Snap(this.svg);

    this.gaq = (typeof window._gaq === 'undefined') ? [] : window._gaq;
  }

  keypressListener(event) {
    if (event.shiftKey && event.keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }

      this.form.dispatchEvent(customEvent('submit'));
    }
  }

  documentKeypressListener(event) {
    if (event.keyCode === 27 && this.runningParser) {
      this.runningParser.cancel();
    }
  }

  submitListener(event) {
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }

    try {
      this._setHash(this.field.value);
    }
    catch(e) {
      // Most likely failed to set the URL has (probably because the expression
      // is too long). Turn off the permalink and just show the expression
      this.permalinkEnabled = false;
      this.showExpression(this.field.value);
    }
  }

  hashchangeListener() {
    this.permalinkEnabled = true;
    this.showExpression(this._getHash());
  }

  updatePercentage(event) {
    this.percentage.style.width = event.detail.percentage * 100 + '%';
  }

  bindListeners() {
    this.field.addEventListener('keypress', this.keypressListener.bind(this));
    this.form.addEventListener('submit', this.submitListener.bind(this));
    this.root.addEventListener('updateStatus', this.updatePercentage.bind(this));
    this.root.addEventListener('keyup', this.documentKeypressListener.bind(this));
    window.addEventListener('hashchange', this.hashchangeListener.bind(this));
  }

  _setHash(hash) {
    location.hash = encodeURIComponent(hash);
  }

  _getHash() {
    return decodeURIComponent(location.hash.slice(1));
  }

  _trackEvent(category, action) {
    this.gaq.push(['_trackEvent', category, action]);
  }

  set state(state) {
    this.root.className = state;
  }

  get state() {
    return this.root.className;
  }

  showExpression(expression) {
    this.field.value = expression;
    this.state = '';

    if (expression !== '') {
      this.renderRegexp(expression).done();
    }
  }

  buildBlobURL(content) {
    var blob = new Blob([content], { type: 'image/svg+xml' });
    window.blob = blob; // Blob object has to stick around for IE
    return URL.createObjectURL(blob);
  }

  updateLinks() {
    try {
      this.download.parentNode.style.display = null;
      this.download.href = this.buildBlobURL(this.svg.parentNode.innerHTML);
    }
    catch(e) {
      // Blobs or URLs created from them don't work here.
      // Giving up on the download link
      this.download.parentNode.style.display = 'none';
    }

    if (this.permalinkEnabled) {
      this.permalink.parentNode.style.display = null;
      this.permalink.href = location.toString();
    } else {
      this.permalink.parentNode.style.display = 'none';
    }
  }

  renderRegexp(expression) {
    if (this.runningParser) {
      let deferred = Q.defer();

      this.runningParser.cancel();

      setTimeout(() => {
        deferred.resolve(this.renderRegexp(expression));
      }, 10);

      return deferred.promise;
    }

    this.state = 'is-loading';
    this._trackEvent('visualization', 'start');

    this.runningParser = new Parser();

    return this.runningParser.parse(expression)
      .then(null, message => {
        this.state = 'has-error';
        this.error.innerHTML = '';
        this.error.appendChild(document.createTextNode(message));

        this._trackEvent('visualization', 'parse error');

        throw message;
      })
      .invoke('render', this.snap, this.padding)
      .then(() => {
        this.state = 'has-results';
        this.updateLinks();
        this._trackEvent('visualization', 'complete');
      })
      .then(null, message => {
        if (message === 'Render cancelled') {
          this._trackEvent('visualization', 'cancelled');
          this.state = '';
        } else {
          this._trackEvent('visualization', 'exception');
          throw message;
        }
      })
      .finally(() => {
        this.runningParser = false;
      });
  }
}
