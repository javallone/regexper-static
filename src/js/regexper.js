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

    location.hash = this.field.value;
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
        }).bind(this), this.showError.bind(this));
    }
  }

  bindListeners() {
    this.field.addEventListener('keypress', this.keypressListener.bind(this));

    this.form.addEventListener('submit', this.submitListener.bind(this));

    window.addEventListener('hashchange', this.hashchangeListener.bind(this));
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
  }

  updateLinks() {
    var blob, url;

    blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    url = URL.createObjectURL(blob);

    this.download.setAttribute('href', url);
    this.permalink.setAttribute('href', location);
  }

  renderSvg(snap, expression) {
    var result;

    snap.selectAll('g').remove();

    result = parser.parse(expression);
    result.container = snap.group();
    result.render();

    return result;
  }

  positionSvg(snap, parsed) {
    var box;

    parsed.position();

    box = parsed.container.getBBox();
    parsed.container.transform(Snap.matrix()
      .translate(this.padding - box.x, this.padding - box.y));
    snap.attr({
      width: box.width + this.padding * 2,
      height: box.height + this.padding * 2
    });
  }

  renderRegexp(expression) {
    var padding = this.padding,
        snap = Snap(this.svg),
        promise;

    promise = Q.promise(((resolve, reject, notify) => {
      resolve(this.renderSvg(snap, expression));
    }).bind(this));

    promise.then(this.positionSvg.bind(this, snap));

    return promise;
  }
}
