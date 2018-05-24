import React from 'react';

import Message from 'components/Message';
import AlertIcon from 'feather-icons/dist/icons/alert-octagon.svg';
import Header from 'components/Header';
import Footer from 'components/Footer';
import App from 'components/App';

const Component = () => (
  <React.Fragment>
    <Header/>
    <noscript>
      <Message type="error" icon={ AlertIcon } heading="JavaScript Required">
        <p>You need to enable JavaScript to use Regexper.</p>
        <p>If you have concerns regarding the use of tracking code on Regexper, please see the <a href="/privacy.html">Privacy Policy</a>.</p>
      </Message>
    </noscript>
    <App/>
    <Footer/>
  </React.Fragment>
);

export default Component;
