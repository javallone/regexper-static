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
    if (event.shiftKey && event.keyCode === 13) {
      event.preventDefault();
      this.form.dispatchEvent(new Event('submit'));
    }
  }

  submitListener(event) {
    event.preventDefault();

    location.hash = encodeURIComponent(this.field.value);
  }

  hashchangeListener() {
    var expression = decodeURIComponent(location.hash.slice(1));

    if (expression !== '') {
      this.field.value = expression;

      this.setState('is-loading');

      this.renderRegexp(expression.replace(/[\r\n]/g, ''))
        .then((() => {
          this.setState('has-results');
          this.updateLinks();
        }).bind(this))
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
    var classList = this.root.classList;

    classList.remove('is-loading', 'has-results', 'has-error');
    classList.add(state);
  }

  showError(message) {
    this.setState('has-error');
    this.error.innerHTML = '';
    this.error.appendChild(document.createTextNode(message));

    throw message;
  }

  updateLinks() {
    var blob, url;

    blob = new Blob([this.svg.outerHTML], { type: 'image/svg+xml' });
    url = URL.createObjectURL(blob);

    this.download.setAttribute('href', url);
    this.permalink.setAttribute('href', location);
  }

  renderRegexp(expression) {
    var snap = Snap(this.svg),
        padding = this.padding;

    snap.selectAll('g').remove();

    parser.resetGroupCounter();

    return Q.fcall(parser.parse.bind(parser), expression)
      .then(null, this.showError.bind(this))
      .invoke('render', snap.group())
      .then((result) => {
        var box;

        box = result.getBBox();
        result.container.transform(Snap.matrix()
          .translate(padding - box.x, padding - box.y));
        snap.attr({
          width: box.width + padding * 2,
          height: box.height + padding * 2
        });
      });
  }
}
