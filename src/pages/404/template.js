import 'babel-register';
import React from 'react';

import PageTemplate, { renderToString } from '../../components/PageTemplate';
import Message from '../../components/Message';
import AlertIcon from 'feather-icons/dist/icons/alert-octagon.svg';

export default renderToString(
  <PageTemplate>
    <Message className="error" icon={ AlertIcon } heading="404 Page Not Found">
      <p>The page you have requested could not be found</p>
    </Message>
  </PageTemplate>
);
