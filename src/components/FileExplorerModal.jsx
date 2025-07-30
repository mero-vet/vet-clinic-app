import React, { useState } from 'react';
import { MdClose, MdMinimize, MdFolder, MdPerson, MdImage, MdMusicNote, MdVideoLibrary, MdStorage, MdCloud } from 'react-icons/md';

const FileExplorerModal = ({ isOpen, onClose, onSave }) => {
  const [fileName, setFileName] = useState('');
  const [saveAsType, setSaveAsType] = useState('Text File (*.txt)');
  const [currentPath, setCurrentPath] = useState('Desktop');

  const folders = [
    { name: 'Icons', icon: MdFolder },
    { name: 'Nina', icon: MdFolder },
    { name: 'office (sql1) - Shortcut', icon: MdStorage },
    { name: 'SDS - Shortcut', icon: MdStorage }
  ];

  const sidebarItems = [
    { name: 'Home', icon: MdFolder },
    { name: 'Gallery', icon: MdImage },
    { name: 'OneDrive - Person', icon: MdCloud },
    { name: 'Desktop', icon: MdFolder, active: true },
    { name: 'Downloads', icon: MdFolder },
    { name: 'Documents', icon: MdFolder },
    { name: 'Pictures', icon: MdImage },
    { name: 'Veterinary Clinic', icon: MdFolder },
    { name: 'Music', icon: MdMusicNote },
    { name: 'Videos', icon: MdVideoLibrary },
    { name: 'PowerBI', icon: MdFolder },
    { name: 'Google Drive (...', icon: MdCloud },
    { name: '2025', icon: MdFolder },
    { name: 'Accounting and F', icon: MdFolder },
    { name: '2025', icon: MdFolder },
    { name: 'Inventory', icon: MdFolder },
    { name: 'This PC', icon: MdStorage }
  ];

  const fileTypes = [
    'Text File (*.txt)',
    'CSV File (*.csv)',
    'Excel File (*.xlsx)',
    'PDF File (*.pdf)',
    'All Files (*.*)'
  ];

  const handleSave = () => {
    if (fileName.trim()) {
      onSave(fileName, saveAsType);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="file-explorer-modal">
        {/* Title Bar */}
        <div className="modal-title-bar">
          <div className="title-left">
            <div className="save-icon"></div>
            <span>Save As</span>
          </div>
          <div className="title-buttons">
            <button className="title-btn minimize-btn">
              <MdMinimize size={12} />
            </button>
            <button className="title-btn">□</button>
            <button className="title-btn close-btn" onClick={onClose}>
              <MdClose size={12} />
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="explorer-nav">
          <div className="nav-buttons">
            <button className="nav-btn">←</button>
            <button className="nav-btn">→</button>
            <button className="nav-btn">↑</button>
            <button className="nav-btn">⟲</button>
          </div>
          <div className="path-bar">
            <div className="folder-icon">📁</div>
            <span>Desktop</span>
            <span className="path-arrow">▼</span>
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Search Desktop" />
            <button className="search-btn">🔍</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="explorer-content">
          {/* Sidebar */}
          <div className="explorer-sidebar">
            <div className="sidebar-section">
              <button className="organize-btn">Organize ▼</button>
              <button className="new-folder-btn">New folder</button>
            </div>
            
            <div className="sidebar-items">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`sidebar-item ${item.active ? 'active' : ''}`}>
                    <Icon size={16} />
                    <span>{item.name}</span>
                    {item.name.includes('...') && <span className="expand-arrow">▶</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Area */}
          <div className="file-area">
            <div className="file-grid">
              {folders.map((folder, index) => {
                const Icon = folder.icon;
                return (
                  <div key={index} className="file-item">
                    <Icon size={32} color="#ffd700" />
                    <span>{folder.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="save-controls">
          <div className="file-input-section">
            <label>File name:</label>
            <input 
              type="text" 
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="file-name-input"
            />
          </div>
          
          <div className="file-type-section">
            <label>Save as type:</label>
            <select 
              value={saveAsType}
              onChange={(e) => setSaveAsType(e.target.value)}
              className="file-type-select"
            >
              {fileTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="hide-folders">
            <button className="hide-folders-btn">▲ Hide Folders</button>
          </div>

          <div className="action-buttons">
            <button className="save-btn" onClick={handleSave} disabled={!fileName.trim()}>
              Save
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorerModal;
