import 'babel-register';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import PageTemplate from './components/PageTemplate';
import Message from './components/Message';
import AlertIcon from 'feather-icons/dist/icons/alert-octagon.svg';

module.exports = '<!DOCTYPE html>' + ReactDOMServer.renderToString(
  <PageTemplate>
    <noscript>
      <Message icon={ AlertIcon } heading="JavaScript Required">
        <p>You need to enable JavaScript to use Regexper.</p>
        <p>Regexper and the tools used to create it are all open source. If you are concerned that the JavaScript being delivered is in any way malicious, please inspect the source by following the GitHub link in the header. There are two data collection tools integrated in the app: Google Analytics and Sentry.io. Google Analytics is used to track browser usage data and application performance. Sentry.io is a tool used to capture and report client-side JavaScript errors. Most popular ad blockers will prevent these tools from sending any tracking data, and doing so will <b>not</b> impact the performance of this app. Regexper is not supported by ad revenue or sales of any kind.</p>
      </Message>
    </noscript>

    <div id="root"></div>
  </PageTemplate>
);
