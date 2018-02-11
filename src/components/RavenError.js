import React from 'react';
import PropTypes from 'prop-types';
import { Raven } from '../sentry';

import Message from './Message';
import AlertIcon from 'feather-icons/dist/icons/alert-octagon.svg';

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
    const { heading } = this.props;

    return <Message className="error" icon={ AlertIcon } heading={ heading }>
      <p>This error has been logged. You may also <a href="#error-report" onClick={ this.reportError }>fill out a report</a>.</p>
    </Message>;
  }
}

RavenError.propTypes = {
  error: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  heading: PropTypes.string.isRequired
};

export default RavenError;
