if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration); // eslint-disable-line no-console
      })
      .catch(registrationError => {
        console.log('SW registration failed:', registrationError); // eslint-disable-line no-console
      });
  });
}
