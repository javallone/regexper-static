import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import URLSearchParams from 'url-search-params';

import style from './style.css';

import Form from 'components/Form';
import Message from 'components/Message';
import SVG from 'components/SVG';
import { demoImage } from 'devel';

const syntaxes = {
  js: 'JavaScript',
  pcre: 'PCRE'
};

class App extends React.PureComponent {
  state = {}

  image = React.createRef()

  componentDidMount() {
    window.addEventListener('hashchange', this.handleHashChange);
    this.handleHashChange();
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  async setSvgUrl() {
    try {
      const type = 'image/svg+xml';
      const blob = await this.image.current.svgUrl(type);

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

  async setPngUrl() {
    try {
      const type = 'image/png';
      const blob = await this.image.current.pngUrl(type);

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

  handleSubmit = ({expr, syntax}) => {
    if (expr) {
      const params = new URLSearchParams({ syntax, expr });
      document.location.hash = params.toString();
    }
  }

  handleHashChange = () => {
    const query = document.location.hash.slice(1);
    const params = new URLSearchParams(query);
    const { expr, syntax } = (() => {
      if (params.get('syntax')) {
        return {
          syntax: params.get('syntax'),
          expr: params.get('expr')
        };
      } else {
        // Assuming old-style URL
        return {
          syntax: 'js',
          expr: query
        };
      }
    })();

    if (!expr) {
      return;
    }

    console.log(syntax, expr); // eslint-disable-line no-console
    this.setState({
      image: demoImage,
      permalinkUrl: document.location.toString(),
      syntax,
      expr
    }, async () => {
      await this.image.current.doReflow();
      this.setSvgUrl();
      this.setPngUrl();
    });
  }

  render() {
    const { svgUrl, pngUrl, permalinkUrl, syntax, expr, image } = this.state;
    const downloadUrls = [
      svgUrl,
      pngUrl
    ].filter(Boolean);

    return <React.Fragment>
      <Form
        syntaxes={ syntaxes }
        downloadUrls={ downloadUrls }
        permalinkUrl={ permalinkUrl }
        syntax={ syntax }
        expr={ expr }
        onSubmit={ this.handleSubmit }/>
      <Message type="error" heading="Sample Error">
        <p>Sample error message</p>
      </Message>
      <Message type="warning" heading="Sample Warning">
        <p>Sample warning message</p>
      </Message>
      { image && <div className={ style.render }>
        <SVG data={ image } ref={ this.image }/>
      </div> }
    </React.Fragment>;
  }
}

App.propTypes = {
  t: PropTypes.func
};

export default translate()(App);
export { App };
