import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';

// const { Client } = require('@elastic/elasticsearch');
// const client = new Client({
//   node: 'http://localhost:9200',
//   maxRetries: 5,
//   requestTimeout: 60000,
//   sniffOnStart: true,
// });

export default class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  state = {
    error: null,
    errorInfo: null,
    hasError: false,
  };

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo }, 'componentDidCatch error boundary');
    // client.post({
    //   id: '#1',
    //   index: 'errors',
    //   type: 'javascript_error',
    //   // stored_fields: string | string[],
    //   // preference: string,
    //   // realtime: boolean,
    //   // refresh: boolean,
    //   // routing: string,
    //   _source: {
    //     error,
    //     errorInfo,
    //   },
    //   // _source_excludes: string | string[],
    //   // _source_includes: string | string[],
    //   // version: number,
    // });..

    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId, errorInfo });
    });

    this.setState({ errorInfo, error });
  }

  render() {
    // next code block goes here
    const { hasError, errorInfo, error, eventId } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <div className="card my-5">
          <div className="card-header">
            <p>
              There was an error in loading this page.
              {' '}
              <span
                style={{ cursor: 'pointer', color: '#0077FF' }}
                onClick={() => {
                  window.location.reload();
                }}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && window.location.reload()}
                role="button"
                tabIndex={0}
              >
                Reload this page
              </span>
              {' '}
              {error && error.toString()}
            </p>
          </div>
          <div className="card-body">
            <details className="error-details">
              <summary>Click for error details</summary>
              {errorInfo && errorInfo.componentStack.toString()}
            </details>
          </div>

          <button
            className="bg-primary text-light"
            onClick={() => Sentry.showReportDialog({ eventId })}
          >
            Report feedback
          </button>
        </div>
      );
    }
    return children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};
