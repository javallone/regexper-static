import ReactGA from 'react-ga';

const setupAnalytics = () => {
  ReactGA.initialize(process.env.GA_PROPERTY, {
    debug: (process.env.NODE_ENV !== 'production')
  });
  ReactGA.pageview(document.location.pathname);
};

export default setupAnalytics;
