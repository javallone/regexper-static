import React from 'react';
import PropTypes from 'prop-types';

import RavenError from 'components/RavenError';

class RavenBoundary extends React.Component {
  state = {
    error: null
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error, errorInfo } = this.state;
    const { children } = this.props;

    if (error) {
      const errorProps = {
        details: { extra: errorInfo },
        error
      };

      return <RavenError { ...errorProps }/>;
    } else {
      return children;
    }
  }
}

RavenBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default RavenBoundary;
