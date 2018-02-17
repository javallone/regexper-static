import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { debounce } from 'throttle-debounce';

import style from './style.css';

import Form from 'components/Form';
import Message from 'components/Message';
import renderImage from 'components/SVG';
import { syntaxes, demoImage } from 'devel';

class App extends React.PureComponent {
  state = {
    syntaxes,
    image: demoImage
  }

  setSvgUrl({ markup }) {
    try {
      const type = 'image/svg+xml';
      const blob = new Blob([markup], { type });

      this.setState({
        svgUrl: {
          url: URL.createObjectURL(blob),
          label: this.props.t('Download SVG'),
          filename: 'image.svg',
          type
        }
      });
    }
    catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }

  async setPngUrl({ element, markup }) {
    try {
      const type = 'image/png';
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const loader = new Image();

      loader.width = canvas.width = Number(element.getAttribute('width')) * 2;
      loader.height = canvas.height = Number(element.getAttribute('height')) * 2;

      await new Promise(resolve => {
        loader.onload = resolve;
        loader.src = 'data:image/svg+xml,' + encodeURIComponent(markup);
      });

      context.drawImage(loader, 0, 0, loader.width, loader.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, type));

      this.setState({
        pngUrl: {
          url: URL.createObjectURL(blob),
          label: this.props.t('Download PNG'),
          filename: 'image.png',
          type
        }
      });
    }
    catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }

  handleRender = debounce(0, result => {
    this.setSvgUrl(result);
    this.setPngUrl(result);
  })

  handleSubmit = ({expr, syntax}) => {
    console.log(syntax, expr); // eslint-disable-line no-console
  }

  render() {
    const { svgUrl, pngUrl, syntaxes, image } = this.state;
    const downloadUrls = [
      svgUrl,
      pngUrl
    ].filter(Boolean);

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
        { renderImage(image, { onRender: this.handleRender }) }
      </div>
    </React.Fragment>;
  }
}

App.propTypes = {
  t: PropTypes.func
};

export default translate()(App);
export { App };
