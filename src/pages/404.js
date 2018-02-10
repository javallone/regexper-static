import React from 'react';
import ReactDOM from 'react-dom';

import '../style.css';

import Message from '../components/Message';
import ErrorIcon from '!svg-react-loader!feather-icons/dist/icons/alert-octagon.svg';

ReactDOM.render(
  <Message icon={ ErrorIcon } heading="404 Page Not Found">
    <p>The page you have requested could not be found</p>
  </Message>,
  document.getElementById('root'));
