import Raven from 'raven-js';

const setupRaven = () => {
  if (navigator.doNotTrack !== '1' && window.doNotTrack !== '1') {
    Raven.config(process.env.SENTRY_KEY, {
      whitelistUrls: [/https:\/\/(.*\.)?regexper\.com/],
      environment: process.env.DEPLOY_ENV,
      debug: (process.env.NODE_ENV !== 'production'),
      release: process.env.BUILD_ID
    });
  }
};

export default setupRaven;
