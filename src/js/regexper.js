// The Regexper class manages the top-level behavior for the entire
// application. This includes event handlers for all user interactions.

import util from './util.js';
import Parser from './parser/javascript.js';
import _ from 'lodash';

export default class Regexper {
  constructor(root) {
    this.root = root;
    this.buggyHash = false;
    this.form = root.querySelector('#regexp-form');
    this.field = root.querySelector('#regexp-input');
    this.error = root.querySelector('#error');
    this.warnings = root.querySelector('#warnings');

    this.links = this.form.querySelector('ul');
    this.permalink = this.links.querySelector('a[data-action="permalink"]');
    this.download = this.links.querySelector('a[data-action="download"]');

    this.svgContainer = root.querySelector('#regexp-render');
  }

  // Event handler for key presses in the regular expression form field.
  keypressListener(event) {
    // Pressing Shift-Enter displays the expression.
    if (event.shiftKey && event.keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }

      this.form.dispatchEvent(util.customEvent('submit'));
    }
  }

  // Event handler for key presses while focused anywhere in the application.
  documentKeypressListener(event) {
    // Pressing escape will cancel a currently running render.
    if (event.keyCode === 27 && this.running) {
      this.running.cancel();
    }
  }

  // Event handler for submission of the regular expression. Changes the URL
  // hash which leads to the expression being rendered.
  submitListener(event) {
    event.returnValue = false;
    if (event.preventDefault) {
      event.preventDefault();
    }

    try {
      this._setHash(this.field.value);
    }
    catch(e) {
      // Failed to set the URL hash (probably because the expression is too
      // long). Turn off display of the permalink and just show the expression.
      this.permalinkEnabled = false;
      this.showExpression(this.field.value);
    }
  }

  // Event handler for URL hash changes. Starts rendering of the expression.
  hashchangeListener() {
    var expr = this._getHash();

    if (expr instanceof Error) {
      this.state = 'has-error';
      this.error.innerHTML = 'Malformed expression in URL';
      util.track('send', 'event', 'visualization', 'malformed URL');
    } else {
      this.permalinkEnabled = true;
      this.showExpression(expr);
    }
  }

  // Binds all event listeners.
  bindListeners() {
    this.field.addEventListener('keypress', this.keypressListener.bind(this));
    this.form.addEventListener('submit', this.submitListener.bind(this));
    this.root.addEventListener('keyup', this.documentKeypressListener.bind(this));
    window.addEventListener('hashchange', this.hashchangeListener.bind(this));
  }

  // Detect if https://bugzilla.mozilla.org/show_bug.cgi?id=483304 is in effect
  detectBuggyHash() {
    var url;

    if (typeof window.URL === 'function') {
      try {
        url = new URL('http://regexper.com/#%25');
        this.buggyHash = (url.hash === '#%');
      }
      catch(e) {
        this.buggyHash = false;
      }
    }
  }

  // Set the URL hash. This method exists to facilitate automated testing
  // (since changing the URL can throw off most JavaScript testing tools).
  _setHash(hash) {
    location.hash = encodeURIComponent(hash);
  }

  // Retrieve the current URL hash. This method is also mostly for supporting
  // automated testing, but also does some basic error handling for malformed
  // URLs.
  _getHash() {
    var hash;
    try {
      hash = location.hash.slice(1)
      return this.buggyHash ? hash : decodeURIComponent(hash);
    }
    catch(e) {
      return e;
    }
  }

  // Currently state of the application. Useful values are:
  //  - `''` - State of the application when the page initially loads
  //  - `'is-loading'` - Displays the loading indicator
  //  - `'has-error'` - Displays the error message
  //  - `'has-results'` - Displays rendered results
  set state(state) {
    this.root.className = state;
  }

  get state() {
    return this.root.className;
  }

  // Start the rendering of a regular expression.
  //
  // - __expression__ - Regular expression to display.
  showExpression(expression) {
    this.field.value = expression;
    this.state = '';

    if (expression !== '') {
      this.renderRegexp(expression).catch(util.exposeError);
    }
  }

  // Creates a blob URL for linking to a rendered regular expression image.
  //
  // - __content__ - SVG image markup.
  buildBlobURL(content) {
    // Blob object has to stick around for IE, so the instance is stored on the
    // `window` object.
    window.blob = new Blob([content], { type: 'image/svg+xml' });
    return URL.createObjectURL(window.blob);
  }

  // Update the URLs of the 'download' and 'permalink' links.
  updateLinks() {
    var classes = _.without(this.links.className.split(' '), ['hide-download', 'hide-permalink']);

    // Create the 'download' image URL.
    try {
      this.download.parentNode.style.display = null;
      this.download.href = this.buildBlobURL(this.svgContainer.querySelector('.svg').innerHTML);
    }
    catch(e) {
      // Blobs or URLs created from a blob URL don't work in the current
      // browser. Giving up on the download link.
      classes.push('hide-download');
    }

    // Create the 'permalink' URL.
    if (this.permalinkEnabled) {
      this.permalink.parentNode.style.display = null;
      this.permalink.href = location.toString();
    } else {
      classes.push('hide-permalink');
    }

    this.links.className = classes.join(' ');
  }

  // Display any warnings that were generated while rendering a regular expression.
  //
  // - __warnings__ - Array of warning messages to display.
  displayWarnings(warnings) {
    this.warnings.innerHTML = _.map(warnings, warning => (
      `<li class="inline-icon">${util.icon("#warning")}${warning}</li>`
    )).join('');
  }

  // Render regular expression
  //
  // - __expression__ - Regular expression to render
  renderRegexp(expression) {
    var parseError = false,
        startTime, endTime;

    // When a render is already in progress, cancel it and try rendering again
    // after a short delay (canceling a render is not instantaneous).
    if (this.running) {
      this.running.cancel();

      return util.wait(10).then(() => this.renderRegexp(expression));
    }

    this.state = 'is-loading';
    util.track('send', 'event', 'visualization', 'start');
    startTime = new Date().getTime();

    this.running = new Parser(this.svgContainer);

    return this.running
      // Parse the expression.
      .parse(expression)
      // Display any error messages from the parser and abort the render.
      .catch(message => {
        this.state = 'has-error';
        this.error.innerHTML = '';
        this.error.appendChild(document.createTextNode(message));

        parseError = true;

        throw message;
      })
      // When parsing is successful, render the parsed expression.
      .then(parser => parser.render())
      // Once rendering is complete:
      //  - Update links
      //  - Display any warnings
      //  - Track the completion of the render and how long it took
      .then(() => {
        this.state = 'has-results';
        this.updateLinks();
        this.displayWarnings(this.running.warnings);
        util.track('send', 'event', 'visualization', 'complete');

        endTime = new Date().getTime();
        util.track('send', 'timing', 'visualization', 'total time', endTime - startTime);
      })
      // Handle any errors that happened during the rendering pipeline.
      // Swallows parse errors and render cancellations. Any other exceptions
      // are allowed to continue on to be tracked by the global error handler.
      .catch(message => {
        if (message === 'Render cancelled') {
          util.track('send', 'event', 'visualization', 'cancelled');
          this.state = '';
        } else if (parseError) {
          util.track('send', 'event', 'visualization', 'parse error');
        } else {
          throw message;
        }
      })
      // Finally, mark rendering as complete (and pass along any exceptions
      // that were thrown).
      .then(
        () => {
          this.running = false;
        },
        message => {
          this.running = false;
          throw message;
        }
      );
  }
}
