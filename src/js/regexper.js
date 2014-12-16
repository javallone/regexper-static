import parser from './parser/javascript.js';
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
  }

  keypressListener(event) {
    var evt;

    if (event.shiftKey && event.keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }

      evt = document.createEvent('Event');
      evt.initEvent('submit', true, true);
      this.form.dispatchEvent(evt);
    }
  }

  submitListener(event) {
    event.preventDefault();

    try {
      this.disablePermalink = false;
      location.hash = this.field.value;
    }
    catch(e) {
      // Most likely failed to set the URL has (probably because the expression
      // is too long). Turn off the permalink and just show the expression
      this.disablePermalink = true;
      this.showExpression(this.field.value);
    }
  }

  hashchangeListener() {
    var expression = decodeURIComponent(location.hash.slice(1));

    this.showExpression(expression);
  }

  showExpression(expression) {
    this.field.value = expression;
    this.setState('');

    if (expression !== '') {
      this.setState('is-loading');

      this.renderRegexp(expression.replace(/\n/g, '\\n'))
        .then(() => {
          this.setState('has-results');
          this.updateLinks();
        })
        .done();
    }
  }

  updatePercentage(event) {
    this.percentage.style.width = event.detail.percentage * 100 + '%';
  }

  bindListeners() {
    this.field.addEventListener('keypress', this.keypressListener.bind(this));

    this.form.addEventListener('submit', this.submitListener.bind(this));

    window.addEventListener('hashchange', this.hashchangeListener.bind(this));

    this.root.addEventListener('updateStatus', this.updatePercentage.bind(this));
  }

  setState(state) {
    this.root.className = state;
  }

  showError(message) {
    this.setState('has-error');
    this.error.innerHTML = '';
    this.error.appendChild(document.createTextNode(message));

    throw message;
  }

  updateLinks() {
    var blob, url;

    try {
      blob = new Blob([this.svg.parentNode.innerHTML], { type: 'image/svg+xml' });
      url = URL.createObjectURL(blob);
      window.blob = blob; // Blob object has to stick around for IE

      this.download.setAttribute('href', url);
    }
    catch(e) {
      // Blobs or URLs created from them don't work here.
      // Giving up on the download link
      this.download.parentNode.style.display = 'none';
    }

    if (this.disablePermalink) {
      this.permalink.parentNode.style.display = 'none';
    } else {
      this.permalink.parentNode.style.display = null;
      this.permalink.setAttribute('href', location.toString());
    }
  }

  renderRegexp(expression) {
    var snap = Snap(this.svg);

    snap.selectAll('g').remove();

    parser.resetGroupCounter();

    return Q.fcall(parser.parse.bind(parser), expression)
      .then(null, this.showError.bind(this))
      .invoke('render', snap.group())
      .then(result => {
        var box;

        box = result.getBBox();
        result.container.transform(Snap.matrix()
          .translate(this.padding - box.x, this.padding - box.y));
        snap.attr({
          width: box.width + this.padding * 2,
          height: box.height + this.padding * 2
        });
      });
  }
}
