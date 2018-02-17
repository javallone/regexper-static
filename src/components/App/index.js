import React from 'react';

import style from './style.css';

import Form from 'components/Form';
import Message from 'components/Message';
import renderImage from 'components/SVG';
import { syntaxes, demoImage } from 'devel';

class App extends React.PureComponent {
  state = {
    syntaxes,
    image: demoImage,
    downloadUrls: [
      { url: '#svg', filename: 'image.svg', type: 'image/svg+xml', label: 'Download SVG' },
      { url: '#png', filename: 'image.png', type: 'image/png', label: 'Download PNG' }
    ]
  }

  handleSubmit = ({expr, syntax}) => {
    console.log(syntax, expr); // eslint-disable-line no-console
  }

  render() {
    const { downloadUrls, syntaxes, image } = this.state;

    return <React.Fragment>
      <Form
        syntaxes={ syntaxes }
        downloadUrls={ downloadUrls }
        permalinkUrl="#permalink"
        onSubmit={ this.handleSubmit }/>
      <Message type="error" heading="Sample Error">
        <p>Sample error message</p>
      </Message>
      <Message type="warning" heading="Sample Warning">
        <p>Sample warning message</p>
      </Message>
      <div className={ style.render }>
        { renderImage(image) }
      </div>
    </React.Fragment>;
  }
}

export default App;
