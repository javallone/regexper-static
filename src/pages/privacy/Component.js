import React from 'react';
import { translate, Trans } from 'react-i18next';

import Message from 'components/Message';
import InfoIcon from 'feather-icons/dist/icons/info.svg';
import Header from 'components/Header';
import Footer from 'components/Footer';

const Component = () => (
  <React.Fragment>
    <Header/>
    <Message type="info" icon={ InfoIcon } heading="Privacy Policy"><Trans i18nKey="Privacy Policy Content">
      <p>Regexper and the tools used to create it are all open source. If you are concerned that the JavaScript being delivered is in any way malicious, please inspect the source by following the <a href="https://github.com/javallone/regexper-static" rel="external noopener noreferrer" target="_blank">GitHub repository</a>.</p>
      <p>There are two data collection tools integrated in the app. These tools are not used to collect personal information:</p>
      <ul>
        <li><b>Google Analytics</b> is used to track browser usage data and application performance.</li>
        <li><b>Sentry.io</b> is a tool used to capture and report client-side JavaScript errors.</li>
      </ul>
      <p>Regexper honors the browser <b>&ldquo;Do Not Track&rdquo;</b> setting and will not enable these data collection tools if that setting is enabled. Also, most popular ad blockers will prevent these tools from sending any tracking data. Disabling or blocking these data collection tools will <b>not</b> impact the performance of this app. The information collected by these tools is used to monitor application performance, determine browser support, and collect error reports.</p>
      <p>Regexper is not supported by ad revenue or sales of any kind.</p>
    </Trans></Message>
    <Footer/>
  </React.Fragment>
);

export default translate()(Component);
export { Component };
