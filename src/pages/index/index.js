import React from 'react';
import ReactDOM from 'react-dom';

import App from '../../components/App';

import '../../style.css';
import { setupServiceWorker } from '../../service-worker';
import { setupGA } from '../../analytics';
import { setupRaven } from '../../sentry';

setupRaven();
setupGA();
if (process.env.NODE_ENV === 'production') {
  setupServiceWorker();
}

ReactDOM.render(<App/>, document.getElementById('root'));
