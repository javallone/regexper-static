import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

import pkg from '../../package.json';

import GithubIcon from 'feather-icons/dist/icons/github.svg';

const PageTemplate = ({ title, children }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content={ pkg.description } />

      <link rel="author" href="/humans.txt" />

      <title>Regexper{ title && (' - ' + title) }</title>
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

      { children }

      <footer>
        <ul className="inline-list">
          <li>
            Created by <a href="mailto:jeff.avallone@gmail.com">Jeff Avallone</a>
          </li>
          <li>
            Generated images licensed: <a rel="license" href="http://creativecommons.org/licenses/by/3.0/">
              <img
                alt="Creative Commons CC-BY-3.0 License"
                src="https://licensebuttons.net/l/by/3.0/80x15.png" />
            </a>
          </li>
        </ul>
      </footer>
    </body>
  </html>
);

PageTemplate.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element
};

const renderToString = content => '<!DOCTYPE html>' + ReactDOMServer.renderToString(content);

export default PageTemplate;
export { renderToString };
