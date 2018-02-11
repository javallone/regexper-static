import React from 'react';
import ReactDOM from 'react-dom';

import App from '../../components/App';
import RavenBoundary from '../../components/RavenBoundary';

import '../../style.css';
import '../../i18n';
import { setupServiceWorker } from '../../service-worker';
import { setupGA } from '../../analytics';
import { Raven, setupRaven } from '../../sentry';

setupRaven();

try {
  setupGA();
  if (process.env.NODE_ENV === 'production') {
    setupServiceWorker();
  }

  ReactDOM.render(
    <RavenBoundary>
      <App/>
    </RavenBoundary>,
    document.getElementById('root'));
}
catch (e) {
  Raven.captureException(e);
}
