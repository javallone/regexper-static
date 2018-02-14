import React from 'react';

import Form from 'components/Form';
import Message from 'components/Message';

const syntaxes = {
  js: 'JavaScript',
  pcre: 'PCRE'
};

const downloadUrls = [
  { url: '#svg', filename: 'image.svg', type: 'image/svg+xml', label: 'Download SVG' },
  { url: '#png', filename: 'image.png', type: 'image/png', label: 'Download PNG' }
];

const handleSubmit = ({ expr, syntax}) => console.log(syntax, expr); // eslint-disable-line no-console

const App = () => <React.Fragment>
  <Form
    syntaxes={ syntaxes }
    downloadUrls={ downloadUrls }
    permalinkUrl="#permalink"
    onSubmit={ handleSubmit }/>
  <Message heading="React App">
    <p>Placeholder app content</p>
  </Message>
</React.Fragment>;

export default App;
