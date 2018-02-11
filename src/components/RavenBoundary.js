import React from 'react';
import PropTypes from 'prop-types';

import RavenError from './RavenError';

class RavenBoundary extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    const { error, errorInfo } = this.state;
    const { children } = this.props;

    if (error) {
      const errorProps = {
        heading: 'An error has occurred.',
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
