import React from 'react';

/**
 * LoadingState component for consistent loading indicators across the app
 * Provides accessible loading states that computer use agents can detect
 */
export const LoadingState = ({ loading, children, testId, loadingText = 'Loading...' }) => {
  return (
    <div 
      data-loading={loading} 
      data-testid={testId}
      aria-busy={loading}
      style={{ position: 'relative' }}
    >
      {loading && (
        <div 
          className="loading-indicator" 
          role="status"
          aria-live="polite"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div 
            className="spinner" 
            aria-hidden="true"
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <span className="sr-only">{loadingText}</span>
          <span aria-hidden="true" style={{ fontSize: '14px', color: '#666' }}>
            {loadingText}
          </span>
        </div>
      )}
      <div style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
        {children}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;