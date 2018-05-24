import ReactGA from 'react-ga';

const setupAnalytics = () => {
  if (navigator.doNotTrack !== '1' && window.doNotTrack !== '1') {
    ReactGA.initialize(process.env.GA_PROPERTY, {
      debug: (process.env.NODE_ENV !== 'production')
    });
    ReactGA.pageview(document.location.pathname);
  }
};

export default setupAnalytics;
