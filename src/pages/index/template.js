import 'babel-register';
import React from 'react';

import '../../i18n';

import PageTemplate, { renderToString } from '../../components/PageTemplate';
import Message from '../../components/Message';
import AlertIcon from 'feather-icons/dist/icons/alert-octagon.svg';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default renderToString(
  <PageTemplate>
    <Header/>
    <noscript>
      <Message className="error" icon={ AlertIcon } heading="JavaScript Required">
        <p>You need to enable JavaScript to use Regexper.</p>
        <p>Regexper and the tools used to create it are all open source. If you are concerned that the JavaScript being delivered is in any way malicious, please inspect the source by following the GitHub link in the header. There are two data collection tools integrated in the app:</p>
        <ul>
          <li><b>Google Analytics</b> is used to track browser usage data and application performance.</li>
          <li><b>Sentry.io</b> is a tool used to capture and report client-side JavaScript errors.</li>
        </ul>
        <p>Most popular ad blockers will prevent these tools from sending any tracking data, and doing so will <b>not</b> impact the performance of this app. Regexper is not supported by ad revenue or sales of any kind. The information collected by these tools is used to monitor application performance, determine browser support, and collect error reports.</p>
      </Message>
    </noscript>
    <Footer/>
  </PageTemplate>
);
