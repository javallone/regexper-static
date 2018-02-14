import React from 'react';
import ReactDOM from 'react-dom';

import Component from './Component';
import RavenBoundary from 'components/RavenBoundary';

import 'site.css';
import 'i18n';
import { setupGA } from 'analytics';
import { Raven, setupRaven } from 'sentry';

setupRaven();

try {
  setupGA();

  ReactDOM.render(
    <RavenBoundary>
      <Component/>
    </RavenBoundary>,
    document.getElementById('root'));
}
catch (e) {
  Raven.captureException(e);
}
