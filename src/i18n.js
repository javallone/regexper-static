import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

import locales from './locales';

i18n
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    debug: (process.env.NODE_ENV !== 'production'),
    resources: locales
  });

export default i18n;
