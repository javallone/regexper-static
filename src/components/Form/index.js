import React from 'react';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';

import DownloadIcon from 'feather-icons/dist/icons/download.svg';
import LinkIcon from 'feather-icons/dist/icons/link.svg';
import ExpandIcon from 'feather-icons/dist/icons/chevrons-down.svg';

import style from './style.css';

class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      syntax: props.syntax || Object.keys(props.syntaxes)[0],
      expr: props.expr
    };
  }

  componentWillReceiveProps(next) {
    if (this.props.expr !== next.expr) {
      this.setState({
        expr: next.expr
      });
    }

    if (this.props.syntax !== next.syntax) {
      this.setState({
        syntax: next.syntax
      });
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit.call(this, {
      expr: this.state.expr,
      syntax: this.state.syntax
    });
  }

  handleKeyPress = event => {
    if (event.charCode === 13 && event.shiftKey) {
      this.handleSubmit(event);
    }
  }

  handleChange = event => this.setState({ [event.target.name]: event.target.value })

  permalinkAction() {
    const { permalinkUrl } = this.props;

    if (!permalinkUrl) {
      return;
    }

    return <li>
      <a href={ permalinkUrl }><LinkIcon/><Trans>Permalink</Trans></a>
    </li>;
  }

  downloadActions() {
    const { downloadUrls } = this.props;

    if (!downloadUrls) {
      return;
    }

    return downloadUrls.map(({ url, filename, type, label }, i) => <li key={ i }>
      <a href={ url } download={ filename } type={ type }>
        <DownloadIcon/>{ label }
      </a>
    </li>);
  }

  render() {
    const { syntaxes, t } = this.props;
    const { expr, syntax } = this.state;

    return <div className={ style.form }>
      <form onSubmit={ this.handleSubmit }>
        <textarea
          name="expr"
          value={ expr }
          onKeyPress={ this.handleKeyPress }
          onChange={ this.handleChange }
          autoFocus
          placeholder={ t('Enter regular expression to display') }></textarea>
        <button type="submit"><Trans>Display</Trans></button>
        <div className={ style.select }>
          <select
            name="syntax"
            value={ syntax }
            onChange={ this.handleChange }>
            { Object.keys(syntaxes).map(id => (
              <option value={ id } key={ id }>{ syntaxes[id] }</option>
            )) }
          </select>
          <ExpandIcon/>
        </div>
        <ul className={ style.actions }>
          { this.downloadActions() }
          { this.permalinkAction() }
        </ul>
      </form>

    </div>;
  }
}

Form.propTypes = {
  expr: PropTypes.string,
  syntax: PropTypes.string,
  syntaxes: PropTypes.object,
  onSubmit: PropTypes.func,
  permalinkUrl: PropTypes.string,
  downloadUrls: PropTypes.array,
  t: PropTypes.func
};

export default translate()(Form);
export { Form };
