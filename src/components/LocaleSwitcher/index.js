import React from 'react';
import { translate, Trans } from 'react-i18next';
import i18n from 'i18next';

import style from './style.css';
import ExpandIcon from 'feather-icons/dist/icons/chevrons-down.svg';

import locales from 'locales';

const localeToAvailable = (locale, available, defaultLocale) => {
  if (available.includes(locale)) {
    return locale;
  }

  const parts = locale.split('-');

  if (parts.length > 0 && available.includes(parts[0])) {
    return parts[0];
  }

  return defaultLocale;
};

class LocaleSwitcher extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      current: localeToAvailable(i18n.language || '', Object.keys(locales), 'en')
    };
  }

  localeSelector = React.createRef()

  componentDidMount() {
    i18n.on('languageChanged', this.handleLanguageChange);
  }

  componentWillUnmount() {
    i18n.off('languageChanged', this.handleLanguageChange);
  }

  handleSelectChange = () => {
    i18n.changeLanguage(this.localeSelector.current.value);
  }

  handleLanguageChange = lang => {
    this.setState({ current: lang });
  }

  render() {
    const { current } = this.state;

    return <label>
      <Trans>Language</Trans>
      <div className={ style.switcher }>
        <select value={ current } ref={ this.localeSelector } onChange={ this.handleSelectChange }>
          { Object.keys(locales).map(locale => (
            <option value={ locale } key={ locale }>{ i18n.getFixedT(locale)('/displayName') }</option>
          )) }
        </select>
        <ExpandIcon/>
      </div>
    </label>;
  }
}

export default translate()(LocaleSwitcher);
export { LocaleSwitcher };
