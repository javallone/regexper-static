import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import LangDetector from 'i18next-browser-languagedetector';

import locales from './locales';

i18n
  .use(reactI18nextModule)
  .use(LangDetector)
  .init({
    fallbackLng: 'en',
    fallbackNS: 'missing',
    debug: (process.env.NODE_ENV !== 'production'),
    resources: locales
  });

export default i18n;
