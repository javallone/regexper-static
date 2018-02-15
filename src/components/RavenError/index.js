import React from 'react';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';
import Raven from 'raven-js';

import Message from 'components/Message';

class RavenError extends React.Component {
  componentDidMount() {
    const { error, details } = this.props;
    Raven.captureException(error, details);
  }

  reportError = event => {
    event.preventDefault();

    if (Raven.lastEventId()) {
      Raven.showReportDialog();
    }
  }

  render() {
    const { t } = this.props;

    return <Message type="error" heading={ t('An error has occurred') }>
      <p><Trans i18nKey="This error has been logged">
        This error has been logged. You may also <a href="#error-report" onClick={ this.reportError }>fill out a report</a>.
      </Trans></p>
    </Message>;
  }
}

RavenError.propTypes = {
  error: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  t: PropTypes.func
};

export default translate()(RavenError);
export { RavenError };
