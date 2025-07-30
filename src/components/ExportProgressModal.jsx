import React, { useState, useEffect } from 'react';

const ExportProgressModal = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onClose();
            }, 1000); // Close after 1 second when complete
            return 100;
          }
          return prev + Math.random() * 10; // Random progress increments
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="export-progress-modal">
        <div className="progress-content">
          <div className="progress-header">
            <h3>Exporting Data Record</h3>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {Math.round(Math.min(progress, 100))}%
            </div>
          </div>

          <div className="progress-actions">
            <button className="cancel-progress-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportProgressModal;
