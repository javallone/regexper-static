import React from 'react';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';

import DownloadIcon from 'feather-icons/dist/icons/download.svg';
import LinkIcon from 'feather-icons/dist/icons/link.svg';
import ExpandIcon from 'feather-icons/dist/icons/chevrons-down.svg';

import style from './style.css';

class Form extends React.Component {
  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit.call(this, {
      expr: this.textarea.value,
      syntax: this.syntax.value
    });
  }

  handleKeyPress = event => {
    if (event.charCode === 13 && event.shiftKey) {
      this.handleSubmit(event);
    }
  }

  textareaRef = textarea => this.textarea = textarea

  syntaxRef = syntax => this.syntax = syntax

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

    return <div className={ style.form }>
      <form onSubmit={ this.handleSubmit }>
        <textarea
          ref={ this.textareaRef }
          onKeyPress={ this.handleKeyPress }
          autoFocus
          placeholder={ t('Enter regular expression to display') }></textarea>
        <button type="submit"><Trans>Display</Trans></button>
        <div className={ style.select }>
          <select ref={ this.syntaxRef }>
            { Object.keys(syntaxes).map(id => (
              <option value={ id } key={ id }>{ syntaxes[id] }</option>
            )) }
          </select>
          <ExpandIcon/>
        </div>
        <ul className={ ['inline', 'with-separator', style.actions].join(' ') }>
          { this.downloadActions() }
          { this.permalinkAction() }
        </ul>
      </form>

    </div>;
  }
}

Form.propTypes = {
  syntaxes: PropTypes.object,
  onSubmit: PropTypes.func,
  permalinkUrl: PropTypes.string,
  downloadUrls: PropTypes.array,
  t: PropTypes.func
};

export default translate()(Form);
export { Form };
