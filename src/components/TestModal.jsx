import React from 'react';
import { MdClose, MdMinimize, MdCropSquare } from 'react-icons/md';

const TestModal = ({ isOpen, onClose }) => {
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
          <span className="client-name">Betsy Marshall</span>
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
            <select className="status-dropdown">
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
              <span className="created-text">Created by GhentVet on 5/25/2022 9:51 AM</span>
              <span className="user-icon">👤</span>
            </div>
          </div>
          <div className="content-details">
            <div className="detail-item">
              <span className="detail-icon">✓</span>
              <span className="detail-text">Client has authorized electronic card on file.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestModal; 