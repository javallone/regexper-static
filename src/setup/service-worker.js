const setupServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('SW registered:', registration); // eslint-disable-line no-console
        })
        .catch(registrationError => {
          console.log('SW registration failed:', registrationError); // eslint-disable-line no-console
        });
    });
  }
};

export default setupServiceWorker;
