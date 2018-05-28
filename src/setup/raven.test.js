jest.mock('raven-js');

import Raven from 'raven-js';

import setupRaven from './raven';

describe('setupRaven', () => {
  beforeEach(() => {
    process.env.SENTRY_KEY = 'test key';
  });

  it('intializes with the SENTRY_KEY', () => {
    setupRaven();
    expect(Raven.config).toHaveBeenCalledWith('test key', expect.anything());
  });

  it('sets the environment', () => {
    process.env.DEPLOY_ENV='test environment';
    setupRaven();
    expect(Raven.config).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      environment: 'test environment'
    }));
  });

  it('enables debug mode for development', () => {
    process.env.NODE_ENV='development';
    setupRaven();
    expect(Raven.config).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      debug: true
    }));
  });

  it('disables debug mode for production', () => {
    process.env.NODE_ENV='production';
    setupRaven();
    expect(Raven.config).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      debug: false
    }));
  });

  it('sets the release', () => {
    process.env.BUILD_ID='test ID';
    setupRaven();
    expect(Raven.config).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      release: 'test ID'
    }));
  });

  describe('when "Do Not Track" is set', () => {
    beforeEach(() => {
      navigator.doNotTrack = '1';
      jest.spyOn(global.console, 'log').mockImplementation(Function.prototype);
    });

    afterEach(() => {
      navigator.doNotTrack = undefined;
    });

    it('does not intialize', () => {
      setupRaven();
      expect(Raven.config).not.toHaveBeenCalled();
    });

    it('logs a message', () => {
      setupRaven();
      expect(global.console.log).toHaveBeenCalledWith('Sentry error reporting disabled by Do Not Track');
    });
  });
});
