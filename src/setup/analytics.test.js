jest.mock('react-ga');

import ReactGA from 'react-ga';

import setupAnalytics from './analytics';

describe('setupAnalytics', () => {
  beforeEach(() => {
    process.env.GA_PROPERTY = 'test property';
  });

  it('initializes with the GA_PROPERTY', () => {
    setupAnalytics();
    expect(ReactGA.initialize).toHaveBeenCalledWith('test property', expect.anything());
  });

  it('enables debug mode in development', () => {
    process.env.NODE_ENV = 'development';
    setupAnalytics();
    expect(ReactGA.initialize).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      debug: true
    }));
  });

  it('disabled debug mode in production', () => {
    process.env.NODE_ENV = 'production';
    setupAnalytics();
    expect(ReactGA.initialize).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      debug: false
    }));
  });

  it('triggers a pageview', () => {
    setupAnalytics();
    expect(ReactGA.pageview).toHaveBeenCalled();
  });

  describe('when "Do Not Track" is set', () => {
    beforeEach(() => {
      navigator.doNotTrack = '1';
    });

    afterEach(() => {
      navigator.doNotTrack = undefined;
    });

    it('does not initialize', () => {
      setupAnalytics();
      expect(ReactGA.initialize).not.toHaveBeenCalled();
    });

    it('does not trigger a pageview', () => {
      setupAnalytics();
      expect(ReactGA.pageview).not.toHaveBeenCalled();
    });
  });
});
