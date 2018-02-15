import React from 'react';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

const translate = txt => `translate(${ txt })`;

i18n.init({
  fallbackLng: 'en',
  fallbackNS: 'missing',
  debug: false,
  resources: {}
});

const I18nWrapper = ({ children }) => ( // eslint-disable-line react/prop-types
  <I18nextProvider i18n={ i18n }>
    { React.cloneElement(React.Children.only(children), { t: translate }) }
  </I18nextProvider>
);

export { translate, i18n, I18nWrapper };
