import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

import pkg from '../../package.json';

const PageTemplate = ({ title, children }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content={ pkg.description } />

      <link rel="author" href="/humans.txt" />

      <title>Regexper{ title && (' - ' + title) }</title>
    </head>
    <body data-build-id={ process.env.BUILD_ID }>
      <div id="root">
        { children }
      </div>
    </body>
  </html>
);

PageTemplate.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

const renderToString = content => '<!DOCTYPE html>' + ReactDOMServer.renderToString(content);

export default PageTemplate;
export { renderToString };
