import util from 'src/js/util.js';
import Regexper from 'src/js/regexper.js';
import Parser from 'src/js/parser/javascript.js';
import Snap from 'snapsvg';
import Q from 'q';

describe('regexper.js', function() {

  beforeEach(function() {
    this.root = document.createElement('div');
    this.root.innerHTML = [
      '<form id="regexp-form" action="/"><input type="text" id="regexp-input" /></form>',
      '<div id="error"></div>',
      '<div><a href="#" data-glyph="link-intact"></a></div>',
      '<div><a href="#" data-glyph="data-transfer-download"></a></div>',
      '<div id="progress"><div></div></div>',
      '<div id="regexp-render"><svg></svg></div>'
    ].join('');

    this.regexper = new Regexper(this.root);
    spyOn(this.regexper, '_setHash');
    spyOn(this.regexper, '_getHash').and.returnValue('example hash value');
  });

  describe('#keypressListener', function() {

    beforeEach(function() {
      this.event = util.customEvent('keypress');
      spyOn(this.event, 'preventDefault');
      spyOn(this.regexper.form, 'dispatchEvent');
    });

    describe('when the shift key is not depressed', function() {

      beforeEach(function() {
        this.event.shiftKey = false;
        this.event.keyCode = 13;
      });

      it('does not prevent the default action', function() {
        this.regexper.keypressListener(this.event);
        expect(this.event.returnValue).not.toEqual(false);
        expect(this.event.preventDefault).not.toHaveBeenCalled();
      });

      it('does not trigger a submit event', function() {
        this.regexper.keypressListener(this.event);
        expect(this.regexper.form.dispatchEvent).not.toHaveBeenCalled();
      });

    });

    describe('when the keyCode is not 13 (Enter)', function() {

      beforeEach(function() {
        this.event.shiftKey = true;
        this.event.keyCode = 42;
      });

      it('does not prevent the default action', function() {
        this.regexper.keypressListener(this.event);
        expect(this.event.returnValue).not.toEqual(false);
        expect(this.event.preventDefault).not.toHaveBeenCalled();
      });

      it('does not trigger a submit event', function() {
        this.regexper.keypressListener(this.event);
        expect(this.regexper.form.dispatchEvent).not.toHaveBeenCalled();
      });

    });

    describe('when the shift key is depressed and the keyCode is 13 (Enter)', function() {

      beforeEach(function() {
        this.event.shiftKey = true;
        this.event.keyCode = 13;
      });

      it('prevents the default action', function() {
        this.regexper.keypressListener(this.event);
        expect(this.event.returnValue).not.toEqual(true);
        expect(this.event.preventDefault).toHaveBeenCalled();
      });

      it('triggers a submit event', function() {
        var event;

        this.regexper.keypressListener(this.event);
        expect(this.regexper.form.dispatchEvent).toHaveBeenCalled();

        event = this.regexper.form.dispatchEvent.calls.mostRecent().args[0];
        expect(event.type).toEqual('submit');
      });

    });

  });

  describe('#documentKeypressListener', function() {

    beforeEach(function() {
      this.event = util.customEvent('keyup');
      this.regexper.runningParser = jasmine.createSpyObj('parser', ['cancel']);
    });

    describe('when the keyCode is not 27 (Escape)', function() {

      beforeEach(function() {
        this.event.keyCode = 42;
      });

      it('does not cancel the parser', function() {
        this.regexper.documentKeypressListener(this.event);
        expect(this.regexper.runningParser.cancel).not.toHaveBeenCalled();
      });

    });

    describe('when the keyCode is 27 (Escape)', function() {

      beforeEach(function() {
        this.event.keyCode = 27;
      });

      it('cancels the parser', function() {
        this.regexper.documentKeypressListener(this.event);
        expect(this.regexper.runningParser.cancel).toHaveBeenCalled();
      });

    });

  });

  describe('#submitListener', function() {

    beforeEach(function() {
      this.event = util.customEvent('submit');
      spyOn(this.event, 'preventDefault');

      this.regexper.field.value = 'example value';
    });

    it('prevents the default action', function() {
      this.regexper.submitListener(this.event);
      expect(this.event.returnValue).not.toEqual(true);
      expect(this.event.preventDefault).toHaveBeenCalled();
    });

    it('sets the location.hash', function() {
      this.regexper.submitListener(this.event);
      expect(this.regexper._setHash).toHaveBeenCalledWith('example value');
    });

    describe('when setting location.hash fails', function() {

      beforeEach(function() {
        this.regexper._setHash.and.throwError('hash failure');
      });

      it('disables the permalink', function() {
        this.regexper.submitListener(this.event);
        expect(this.regexper.permalinkEnabled).toEqual(false);
      });

      it('shows the expression directly', function() {
        spyOn(this.regexper, 'showExpression');
        this.regexper.submitListener(this.event);
        expect(this.regexper.showExpression).toHaveBeenCalledWith('example value');
      });

    });

  });

  describe('#hashchangeListener', function() {

    it('enables the permalink', function() {
      this.regexper.hashchangeListener();
      expect(this.regexper.permalinkEnabled).toEqual(true);
    });

    it('shows the expression from the hash', function() {
      spyOn(this.regexper, 'showExpression');
      this.regexper.hashchangeListener();
      expect(this.regexper.showExpression).toHaveBeenCalledWith('example hash value');
    });

  });

  describe('#updatePercentage', function() {

    beforeEach(function() {
      this.event = util.customEvent('updateStatus', { percentage: 0.42 });
    });

    it('sets the width of the progress bar', function() {
      this.regexper.updatePercentage(this.event);
      expect(this.regexper.percentage.style.width).toEqual('42%');
    });

  });

  describe('#bindListeners', function() {

    beforeEach(function() {
      spyOn(this.regexper, 'keypressListener');
      spyOn(this.regexper, 'submitListener');
      spyOn(this.regexper, 'updatePercentage');
      spyOn(this.regexper, 'documentKeypressListener');
      spyOn(this.regexper, 'hashchangeListener');
    });

    it('binds #keypressListener to keypress on the text field', function() {
      spyOn(this.regexper.field, 'addEventListener');
      this.regexper.bindListeners();
      expect(this.regexper.field.addEventListener).toHaveBeenCalledWith('keypress', jasmine.any(Function));

      this.regexper.field.addEventListener.calls.mostRecent().args[1]();
      expect(this.regexper.keypressListener).toHaveBeenCalled();
    });

    it('binds #submitListener to submit on the form', function() {
      spyOn(this.regexper.form, 'addEventListener');
      this.regexper.bindListeners();
      expect(this.regexper.form.addEventListener).toHaveBeenCalledWith('submit', jasmine.any(Function));

      this.regexper.form.addEventListener.calls.mostRecent().args[1]();
      expect(this.regexper.submitListener).toHaveBeenCalled();
    });

    it('binds #updatePercentage to updateStatus on the root', function() {
      spyOn(this.regexper.root, 'addEventListener');
      this.regexper.bindListeners();
      expect(this.regexper.root.addEventListener).toHaveBeenCalledWith('updateStatus', jasmine.any(Function));

      this.regexper.root.addEventListener.calls.first().args[1]();
      expect(this.regexper.updatePercentage).toHaveBeenCalled();
    });

    it('binds #documentKeypressListener to keyup on the root', function() {
      spyOn(this.regexper.root, 'addEventListener');
      this.regexper.bindListeners();
      expect(this.regexper.root.addEventListener).toHaveBeenCalledWith('keyup', jasmine.any(Function));

      this.regexper.root.addEventListener.calls.mostRecent().args[1]();
      expect(this.regexper.documentKeypressListener).toHaveBeenCalled();
    });

    it('binds #hashchangeListener to hashchange on the window', function() {
      spyOn(window, 'addEventListener');
      this.regexper.bindListeners();
      expect(window.addEventListener).toHaveBeenCalledWith('hashchange', jasmine.any(Function));

      window.addEventListener.calls.mostRecent().args[1]();
      expect(this.regexper.hashchangeListener).toHaveBeenCalled();
    });

  });

  describe('#_trackEvent', function() {

    it('adds a _trackEvent call to gaq', function() {
      this.regexper._trackEvent('category', 'action');
      expect(this.regexper.gaq).toContain(['_trackEvent', 'category', 'action']);
    });

  });

  describe('#showExpression', function() {

    beforeEach(function() {
      spyOn(this.regexper, 'renderRegexp').and.returnValue(jasmine.createSpyObj('renderRegexp', ['done']));
    });

    it('sets the text field value', function() {
      this.regexper.showExpression('example expression');
      expect(this.regexper.field.value).toEqual('example expression');
    });

    it('clears the state', function() {
      this.regexper.showExpression('');
      expect(this.regexper.state).toEqual('');
    });

    describe('when the expression is not blank', function() {

      it('renders the expression', function() {
        this.regexper.showExpression('example expression');
        expect(this.regexper.renderRegexp).toHaveBeenCalledWith('example expression');
      });

    });

  });

  describe('#updateLinks', function() {

    beforeEach(function() {
      spyOn(this.regexper, 'buildBlobURL');
    });

    describe('when blob URLs are supported', function() {

      beforeEach(function() {
        this.regexper.buildBlobURL.and.returnValue('http://example.com/blob');
      });

      it('sets the download link href', function() {
        this.regexper.updateLinks();
        expect(this.regexper.download.href).toEqual('http://example.com/blob');
      });

    });

    describe('when blob URLs are not supported', function() {

      beforeEach(function() {
        this.regexper.buildBlobURL.and.throwError('blob failure');
      });

      it('hides the download link', function() {
        this.regexper.updateLinks();
        expect(this.regexper.download.parentNode.style.display).toEqual('none');
      });

    });

    describe('when the permalink is enabled', function() {

      beforeEach(function() {
        this.regexper.permalinkEnabled = true;
      });

      it('sets the permalink href', function() {
        this.regexper.updateLinks();
        expect(this.regexper.permalink.href).toEqual(location.toString());
      });

    });

    describe('when the permalink is disabled', function() {

      beforeEach(function() {
        this.regexper.permalinkEnabled = false;
      });

      it('hides the permalink', function() {
        this.regexper.updateLinks();
        expect(this.regexper.permalink.parentNode.style.display).toEqual('none');
      });

    });

  });

  describe('#renderRegexp', function() {

    beforeEach(function() {
      this.parsePromise = Q.defer();
      this.renderPromise = Q.defer();
      spyOn(Parser.prototype, 'parse').and.returnValue(this.parsePromise.promise);
      spyOn(Parser.prototype, 'render').and.returnValue(this.renderPromise.promise);
      spyOn(Parser.prototype, 'cancel');

      spyOn(this.regexper, '_trackEvent');
      spyOn(this.regexper, 'updateLinks');

      this.regexper.renderRegexp('example expression');
    });

    it('sets the state to "is-loading"', function() {
      expect(this.regexper.state).toEqual('is-loading');
    });

    it('tracks the beginning of the render', function() {
      expect(this.regexper._trackEvent).toHaveBeenCalledWith('visualization', 'start');
    });

    it('keeps a copy of the running parser', function() {
      expect(this.regexper.runningParser).toBeTruthy();
    });

    it('parses the expression', function() {
      expect(this.regexper.runningParser.parse).toHaveBeenCalledWith('example expression');
    });

    describe('when parsing fails', function() {

      beforeEach(function(done) {
        this.parsePromise.reject('example parse error');

        setTimeout(done, 10);
      });

      it('sets the state to be "has-error"', function() {
        expect(this.regexper.state).toEqual('has-error');
      });

      it('displays the error message', function() {
        expect(this.regexper.error.innerHTML).toEqual('example parse error');
      });

      it('tracks the parse error', function() {
        expect(this.regexper._trackEvent).toHaveBeenCalledWith('visualization', 'parse error');
      });

    });

    describe('when parsing succeeds', function() {

      beforeEach(function(done) {
        this.parser = this.regexper.runningParser;
        this.parsePromise.resolve(this.parser);

        setTimeout(done, 10);
      });

      it('renders the expression', function() {
        expect(this.parser.render).toHaveBeenCalledWith(this.regexper.snap, this.regexper.padding);
      });

    });

    describe('when rendering is complete', function() {

      beforeEach(function(done) {
        this.parsePromise.resolve(this.regexper.runningParser);
        this.renderPromise.resolve();

        setTimeout(done, 10);
      });

      it('sets the state to "has-results"', function() {
        expect(this.regexper.state).toEqual('has-results');
      });

      it('updates the links', function() {
        expect(this.regexper.updateLinks).toHaveBeenCalled();
      });

      it('tracks the complete render', function() {
        expect(this.regexper._trackEvent).toHaveBeenCalledWith('visualization', 'complete');
      });

      it('sets the runningParser to false', function() {
        expect(this.regexper.runningParser).toBeFalsy();
      });

    });

    describe('when the rendering is cancelled', function() {

      beforeEach(function(done) {
        this.parsePromise.resolve(this.regexper.runningParser);
        this.renderPromise.reject('Render cancelled');

        setTimeout(done, 10);
      });

      it('clears the state', function() {
        expect(this.regexper.state).toEqual('');
      });

      it('tracks the cancelled render', function() {
        expect(this.regexper._trackEvent).toHaveBeenCalledWith('visualization', 'cancelled');
      });

      it('sets the runningParser to false', function() {
        expect(this.regexper.runningParser).toBeFalsy();
      });

    });

    describe('when the rendering fails', function() {

      beforeEach(function(done) {
        this.parsePromise.resolve(this.regexper.runningParser);
        this.renderPromise.reject('example render failure');

        setTimeout(done, 10);
      });

      it('tracks the failed render', function() {
        expect(this.regexper._trackEvent).toHaveBeenCalledWith('visualization', 'exception');
      });

      it('sets the runningParser to false', function() {
        expect(this.regexper.runningParser).toBeFalsy();
      });

    });

  });

});
