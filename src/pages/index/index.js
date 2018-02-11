import React from 'react';
import ReactDOM from 'react-dom';

import App from '../../components/App';

import '../../style.css';
import '../../service-worker';
import { setupGA } from '../../analytics';

setupGA();

ReactDOM.render(<App/>, document.getElementById('root'));
