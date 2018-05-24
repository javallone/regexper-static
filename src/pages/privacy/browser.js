import React from 'react';
import ReactDOM from 'react-dom';
import Raven from 'raven-js';

import Component from './Component';
import RavenBoundary from 'components/RavenBoundary';

import 'site.css';
import 'i18n';
import setupServiceWorker from 'setup/service-worker';
import setupRaven from 'setup/raven';

setupRaven();

try {
  if (process.env.NODE_ENV === 'production') {
    setupServiceWorker();
  }

  ReactDOM.render(
    <RavenBoundary>
      <Component/>
    </RavenBoundary>,
    document.getElementById('root'));
}
catch (e) {
  Raven.captureException(e);
}
