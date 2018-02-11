import 'babel-register';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Message from './components/Message';
import AlertIcon from 'feather-icons/dist/icons/alert-octagon.svg';
import GithubIcon from 'feather-icons/dist/icons/github.svg';

module.exports = '<!DOCTYPE html>' + ReactDOMServer.renderToString(
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="Regular expression visualizer using railroad diagrams" />

      <link rel="author" href="/humans.txt" />

      <title>Regexper</title>
    </head>
    <body>
      <header id="main">
        <h1>
          <a href="/">Regexper</a>
        </h1>

        <ul>
          <li><a href="https://github.com/javallone/regexper-static">
            <GithubIcon/>Source on GitHub
          </a></li>
        </ul>
      </header>

      <noscript>
        <Message icon={ AlertIcon } heading="JavaScript Required">
          <p>You need to enable JavaScript to use Regexper.</p>
          <p>Regexper and the tools used to create it are all open source. If you are concerned that the JavaScript being delivered is in any way malicious, please inspect the source by following the GitHub link in the header. There are two data collection tools integrated in the app: Google Analytics and Sentry.io. Google Analytics is used to track browser usage data and application performance. Sentry.io is a tool used to capture and report client-side JavaScript errors. Most popular ad blockers will prevent these tools from sending any tracking data, and doing so will <b>not</b> impact the performance of this app. Regexper is not supported by ad revenue or sales of any kind.</p>
        </Message>
      </noscript>

      <div id="root"></div>

      <footer>
        <ul className="inline-list">
          <li>
            Created by <a href="mailto:jeff.avallone@gmail.com">Jeff Avallone</a>
          </li>
          <li>
            Generated images licensed:
            <a rel="license" href="http://creativecommons.org/licenses/by/3.0/"><img
              alt="Creative Commons CC-BY-3.0 License"
              src="https://licensebuttons.net/l/by/3.0/80x15.png" /></a>
          </li>
        </ul>
      </footer>
    </body>
  </html>
);
