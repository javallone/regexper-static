import Raven from 'raven-js';

const setupRaven = () => {
  Raven.config(process.env.SENTRY_KEY, {
    whitelistUrls: [/https:\/\/(.*\.)?regexper\.com/],
    environment: process.env.NODE_ENV,
    debug: (process.env.NODE_ENV !== 'production'),
    release: process.env.BUILD_ID
  });
};

export { setupRaven };
