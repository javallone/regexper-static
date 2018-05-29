import React from 'react';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';

import style from './style.css';

const InstallPrompt = ({ onAccept, onReject }) => (
  <div className={ style.install }>
    <p className={ style.cta }><Trans>Add Regexper to your home screen?</Trans></p>
    <div className={ style.actions }>
      <button className={ style.primary } onClick={ onAccept }><Trans>Add It</Trans></button>
      <button onClick={ onReject }><Trans>No Thanks</Trans></button>
    </div>
  </div>
);

InstallPrompt.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};

export default translate()(InstallPrompt);
export { InstallPrompt };
