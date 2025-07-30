import React, { useEffect } from 'react';
import { MdClose, MdMinimize, MdCropSquare } from 'react-icons/md';

const TestModal = ({ isOpen, onClose, patientData = null }) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="test-modal">
        {/* Title Bar */}
        <div className="test-modal-title-bar">
          <div className="title-left">
            <span className="window-icon">📋</span>
            <span className="window-title">Client</span>
          </div>
          <div className="title-buttons">
            <button className="title-btn minimize-btn">
              <MdMinimize size={12} />
            </button>
            <button className="title-btn maximize-btn">
              <MdCropSquare size={12} />
            </button>
            <button className="title-btn close-btn" onClick={onClose}>
              <MdClose size={12} />
            </button>
          </div>
        </div>

        {/* Client Header */}
        <div className="client-header">
          <span className="client-name">
            {patientData ? `${patientData.firstName} ${patientData.lastName}` : 'Betsy Marshall'}
          </span>
        </div>

        {/* Toolbar */}
        <div className="client-toolbar">
          <button className="client-toolbar-btn">Predefined</button>
          <button className="client-toolbar-btn">New</button>
          <button className="client-toolbar-btn">Edit</button>
          <button className="client-toolbar-btn">Delete</button>
          <button className="client-toolbar-btn">Rename</button>
          <button className="client-toolbar-btn">Print</button>
          <button className="client-toolbar-btn">Sort</button>
          <div className="toolbar-spacer"></div>
          <div className="client-status">
            <span className="status-icon">🏆</span>
            <select className="status-dropdown note-dropdown">
              <option>Green Good Client</option>
              <option>Yellow Caution Client</option>
              <option>Red Problem Client</option>
            </select>
            <span className="status-icon">💰</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="client-content">
          <div className="content-header">
            <div className="content-item">
              <span className="item-icon">📄</span>
              <span className="item-text">Electronic Card on File AUTH</span>
            </div>
            <div className="content-meta">
              <span className="created-text">
                Created by GhentVet on {patientData ? new Date().toLocaleDateString() : '5/25/2022'} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date().toLocaleTimeString().slice(-2)}
              </span>
              <span className="user-icon">👤</span>
            </div>
          </div>
          <div className="content-details">
            <div className="detail-item">
              <span className="detail-icon">✓</span>
              <span className="detail-text">
                {patientData
                  ? `Client ${patientData.firstName} ${patientData.lastName} has authorized electronic card on file for ${patientData.name} (${patientData.species}).`
                  : 'Client has authorized electronic card on file.'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestModal; 