import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import URLSearchParams from 'url-search-params';
import Raven from 'raven-js';

import LoaderIcon from 'feather-icons/dist/icons/loader.svg';

import style from './style.css';

import Form from 'components/Form';
import Message from 'components/Message';
import InstallPrompt from 'components/InstallPrompt';
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
    window.addEventListener('beforeinstallprompt', this.handleInstallPrompt);
    this.handleHashChange();
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('beforeinstallprompt', this.handleInstallPrompt);
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

  async loadSVGComponent() {
    if (this.state.SVG) {
      return;
    }

    this.setState({
      loading: true,
      loadingFailed: false
    });

    try {
      const SVG = await import(/* webpackChunkName: "render" */ 'components/SVG');

      this.setState({
        SVG: SVG.default,
        loading: false
      });
    }
    catch (e) {
      Raven.captureException(e);
      this.setState({
        loading: false,
        loadingFailed: e
      });
      throw e;
    }
  }

  handleInstallPrompt = event => {
    event.preventDefault();

    this.setState({
      installPrompt: event
    });
  }

  handleSubmit = ({expr, syntax}) => {
    if (expr) {
      const params = new URLSearchParams({ syntax, expr });
      document.location.hash = params.toString();
    }
  }

  handleHashChange = async () => {
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

    try {
      await this.loadSVGComponent();
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
    catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }

  handleRetry = async event => {
    event.preventDefault();
    this.handleHashChange();
  }

  handleInstallReject = () => {
    this.setState({ installPrompt: null });
  }

  handleInstallAccept = async () => {
    const { installPrompt } = this.state;

    this.setState({ installPrompt: null });
    installPrompt.prompt();
  }

  render() {
    const {
      SVG,
      loading,
      loadingFailed,
      svgUrl,
      pngUrl,
      permalinkUrl,
      syntax,
      expr,
      image,
      installPrompt
    } = this.state;
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
      {
        loading && <div className={ style.loader }>
          <LoaderIcon />
          <div className={ style.message }>Loading...</div>
        </div>
      }
      {
        loadingFailed && <Message type="error" heading="Render Failure">
          An error occurred while rendering the regular expression. <a href="#retry" onClick={ this.handleRetry }>Retry</a>
        </Message>
      }
      {
        image && <div className={ style.render }>
          <SVG data={ image } ref={ this.image }/>
        </div>
      }
      {
        installPrompt && <InstallPrompt onAccept={ this.handleInstallAccept } onReject={ this.handleInstallReject } />
      }
    </React.Fragment>;
  }
}

App.propTypes = {
  t: PropTypes.func
};

export default translate()(App);
export { App };
