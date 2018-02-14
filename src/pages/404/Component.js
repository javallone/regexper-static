import React from 'react';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';

import Message from 'components/Message';
import AlertIcon from 'feather-icons/dist/icons/alert-octagon.svg';
import Header from 'components/Header';
import Footer from 'components/Footer';

const Component = ({ t }) => (
  <React.Fragment>
    <Header/>
    <Message type="error" icon={ AlertIcon } heading={ t('404 Page Not Found') }>
      <p><Trans>The page you have requested could not be found</Trans></p>
    </Message>
    <Footer/>
  </React.Fragment>
);

Component.propTypes = {
  t: PropTypes.func
};

export default translate()(Component);
