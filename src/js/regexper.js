import util from './util.js';
import Parser from './parser/javascript.js';
import Q from 'q';
import _ from 'lodash';

export default class Regexper {
  constructor(root) {
    this.root = root;
    this.form = root.querySelector('#regexp-form');
    this.field = root.querySelector('#regexp-input');
    this.error = root.querySelector('#error');
    this.warnings = root.querySelector('#warnings');

    this.links = this.form.querySelector('ul');
    this.permalink = this.links.querySelector('a[data-glyph="link-intact"]');
    this.download = this.links.querySelector('a[data-glyph="data-transfer-download"]');

    this.svgContainer = root.querySelector('#regexp-render');
  }

  keypressListener(event) {
    if (event.shiftKey && event.keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }

      this.form.dispatchEvent(util.customEvent('submit'));
    }
  }

  documentKeypressListener(event) {
    if (event.keyCode === 27 && this.running) {
      this.running.cancel();
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

  bindListeners() {
    this.field.addEventListener('keypress', this.keypressListener.bind(this));
    this.form.addEventListener('submit', this.submitListener.bind(this));
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
    window._gaq.push(['_trackEvent', category, action]);
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
    var classes = _.without(this.links.className.split(' '), ['hide-download', 'hide-permalink']);

    try {
      this.download.parentNode.style.display = null;
      this.download.href = this.buildBlobURL(this.svgContainer.querySelector('.svg').innerHTML);
    }
    catch(e) {
      // Blobs or URLs created from them don't work here.
      // Giving up on the download link
      classes.push('hide-download');
    }

    if (this.permalinkEnabled) {
      this.permalink.parentNode.style.display = null;
      this.permalink.href = location.toString();
    } else {
      classes.push('hide-permalink');
    }

    this.links.className = classes.join(' ');
  }

  displayWarnings(warnings) {
    this.warnings.innerHTML = _.map(warnings, warning => {
      return `<li class="oi with-text" data-glyph="warning">${warning}</li>`;
    }).join('');
  }

  renderRegexp(expression) {
    var parseError = false;

    if (this.running) {
      let deferred = Q.defer();

      this.running.cancel();

      setTimeout(() => {
        deferred.resolve(this.renderRegexp(expression));
      }, 10);

      return deferred.promise;
    }

    this.state = 'is-loading';
    this._trackEvent('visualization', 'start');

    this.running = new Parser(this.svgContainer);

    return this.running
      .parse(expression)
      .then(null, message => {
        this.state = 'has-error';
        this.error.innerHTML = '';
        this.error.appendChild(document.createTextNode(message));

        parseError = true;

        throw message;
      })
      .invoke('render')
      .then(() => {
          this.state = 'has-results';
          this.updateLinks();
          this.displayWarnings(this.running.warnings);
          this._trackEvent('visualization', 'complete');
      })
      .then(null, message => {
        if (message === 'Render cancelled') {
          this._trackEvent('visualization', 'cancelled');
          this.state = '';
        } else if (parseError) {
          this._trackEvent('visualization', 'parse error');
        } else {
          throw message;
        }
      })
      .finally(() => {
        this.running = false;
      });
  }
}
