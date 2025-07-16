import React, { Component } from 'react';
import { debugLog } from '../utils/logger';
import { Button, Card } from './design-system';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to external service in production
    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService = (error, errorInfo) => {
    // Implement error logging to external service
    // Example: Sentry, LogRocket, etc.
    const errorData = {
      message: error.toString(),
      stack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    debugLog('Error logged to service:', errorData);
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback, showDetails = import.meta.env.DEV } = this.props;

      if (fallback) {
        return fallback(this.state.error, this.state.errorInfo, this.handleReset);
      }

      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '20px',
          backgroundColor: '#f9fafb'
        }}>
          <Card variant="outlined" padding="large" style={{ maxWidth: '600px', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ margin: '0 auto' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px', textAlign: 'center' }}>
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {showDetails && this.state.error && (
              <details style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Error Details</summary>
                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Error Message:</h3>
                  <pre style={{ fontSize: '12px', overflow: 'auto', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                    {this.state.error.toString()}
                  </pre>

                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>Component Stack:</h3>
                  <pre style={{ fontSize: '12px', overflow: 'auto', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                    {this.state.errorInfo?.componentStack}
                  </pre>

                  <p style={{ fontSize: '12px', marginTop: '16px', color: '#6b7280' }}>
                    This error has occurred {this.state.errorCount} time(s)
                  </p>
                </div>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button onClick={this.handleReset} variant="primary">
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="secondary">
                Reload Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;