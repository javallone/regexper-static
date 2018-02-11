import ReactGA from 'react-ga';

const setupGA = () => {
  ReactGA.initialize(process.env.GA_PROPERTY, {
    debug: (process.env.NODE_ENV !== 'production')
  });
  ReactGA.pageview(document.location.pathname);
};

export { setupGA };
