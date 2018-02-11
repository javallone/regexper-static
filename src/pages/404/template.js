import 'babel-register';
import React from 'react';

import '../../i18n';

import PageTemplate, { renderToString } from '../../components/PageTemplate';
import Component from './Component';

export default renderToString(
  <PageTemplate>
    <Component/>
  </PageTemplate>
);
