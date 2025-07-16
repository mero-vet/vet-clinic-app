/**
 * Higher-Order Component for Error Boundary
 * Automatically wraps components with ErrorBoundary for systematic error handling
 * Part of PRD-20 Phase 2A implementation
 */

import React from 'react';
import ErrorBoundary from '../ErrorBoundary';

/**
 * HOC that wraps a component with ErrorBoundary
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} options - Configuration options
 * @returns {React.Component} - Component wrapped with ErrorBoundary
 */
export const withErrorBoundary = (WrappedComponent, options = {}) => {
    const {
        fallbackComponent: FallbackComponent,
        errorTitle = 'Something went wrong',
        errorMessage = 'An unexpected error occurred. Please refresh the page or contact support if the problem persists.',
        showErrorDetails = process.env.NODE_ENV === 'development',
        onError,
        resetOnPropsChange = [],
        componentName,
    } = options;

    class ErrorBoundaryWrapper extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                hasError: false,
                error: null,
                errorInfo: null,
                errorId: null,
            };
            this.prevProps = props;
        }

        static displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        static getDerivedStateFromError(error) {
            return {
                hasError: true,
                error,
                errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            };
        }

        componentDidCatch(error, errorInfo) {
            this.setState({
                errorInfo,
            });

            // Call custom error handler if provided
            if (onError) {
                onError(error, errorInfo, {
                    componentName: componentName || WrappedComponent.name,
                    props: this.props,
                    errorId: this.state.errorId,
                });
            }

            // Log to global error handler
            if (window.testLogger) {
                window.testLogger.logError({
                    component: componentName || WrappedComponent.name,
                    error: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                    errorId: this.state.errorId,
                    timestamp: Date.now(),
                    url: window.location.href,
                    props: Object.keys(this.props).reduce((acc, key) => {
                        // Avoid logging sensitive or large data
                        if (typeof this.props[key] === 'function') {
                            acc[key] = '[Function]';
                        } else if (typeof this.props[key] === 'object' && this.props[key] !== null) {
                            acc[key] = '[Object]';
                        } else {
                            acc[key] = this.props[key];
                        }
                        return acc;
                    }, {}),
                });
            }
        }

        componentDidUpdate(prevProps) {
            // Reset error boundary if specified props change
            if (this.state.hasError && resetOnPropsChange.length > 0) {
                const hasPropsChanged = resetOnPropsChange.some(
                    propName => prevProps[propName] !== this.props[propName]
                );

                if (hasPropsChanged) {
                    this.setState({
                        hasError: false,
                        error: null,
                        errorInfo: null,
                        errorId: null,
                    });
                }
            }
        }

        handleReset = () => {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                errorId: null,
            });
        };

        handleRefresh = () => {
            window.location.reload();
        };

        render() {
            if (this.state.hasError) {
                // Use custom fallback component if provided
                if (FallbackComponent) {
                    return (
                        <FallbackComponent
                            error={this.state.error}
                            errorInfo={this.state.errorInfo}
                            errorId={this.state.errorId}
                            onReset={this.handleReset}
                            onRefresh={this.handleRefresh}
                            componentName={componentName || WrappedComponent.name}
                        />
                    );
                }

                // Default error UI
                return (
                    <ErrorBoundary
                        error={this.state.error}
                        errorInfo={this.state.errorInfo}
                        errorId={this.state.errorId}
                        errorTitle={errorTitle}
                        errorMessage={errorMessage}
                        showErrorDetails={showErrorDetails}
                        onReset={this.handleReset}
                        onRefresh={this.handleRefresh}
                        componentName={componentName || WrappedComponent.name}
                    />
                );
            }

            return <WrappedComponent {...this.props} />;
        }
    }

    return ErrorBoundaryWrapper;
};

/**
 * Screen-specific error boundary wrapper with predefined options
 * @param {React.Component} ScreenComponent - Screen component to wrap
 * @param {Object} options - Additional options
 * @returns {React.Component} - Screen wrapped with error boundary
 */
export const withScreenErrorBoundary = (ScreenComponent, options = {}) => {
    const defaultOptions = {
        errorTitle: 'Screen Error',
        errorMessage: 'This screen encountered an error. You can try refreshing the page or navigating to a different section.',
        showErrorDetails: process.env.NODE_ENV === 'development',
        componentName: `${ScreenComponent.name}Screen`,
        resetOnPropsChange: ['location', 'params'], // Reset on navigation
        onError: (error, errorInfo, context) => {
            // Screen-specific error handling
            console.error(`Screen Error in ${context.componentName}:`, error);

            // Could trigger screen-specific recovery logic here
            // e.g., clearing state, redirecting to safe screen, etc.
        },
    };

    return withErrorBoundary(ScreenComponent, { ...defaultOptions, ...options });
};

/**
 * Component-specific error boundary wrapper for smaller components
 * @param {React.Component} Component - Component to wrap
 * @param {Object} options - Additional options
 * @returns {React.Component} - Component wrapped with error boundary
 */
export const withComponentErrorBoundary = (Component, options = {}) => {
    const defaultOptions = {
        errorTitle: 'Component Error',
        errorMessage: 'This component encountered an error and has been disabled.',
        showErrorDetails: false, // Don't show details for component errors
        componentName: Component.name,
        onError: (error, errorInfo, context) => {
            console.warn(`Component Error in ${context.componentName}:`, error.message);
        },
    };

    return withErrorBoundary(Component, { ...defaultOptions, ...options });
};

export default withErrorBoundary; 