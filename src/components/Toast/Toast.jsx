import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ id, message, type, duration, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, duration - 300);

      return () => clearTimeout(exitTimer);
    }
  }, [duration]);

  useEffect(() => {
    if (isExiting) {
      const removeTimer = setTimeout(() => {
        onClose();
      }, 300);

      return () => clearTimeout(removeTimer);
    }
  }, [isExiting, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => setIsExiting(true)}>
        ×
      </button>
    </div>
  );
};

export default Toast;