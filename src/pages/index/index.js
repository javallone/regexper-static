import React from 'react';
import ReactDOM from 'react-dom';

import App from '../../components/App';

import '../../style.css';
import { setupServiceWorker } from '../../service-worker';
import { setupGA } from '../../analytics';

if (process.env.NODE_ENV === 'production') {
  setupServiceWorker();
}
setupGA();

ReactDOM.render(<App/>, document.getElementById('root'));
