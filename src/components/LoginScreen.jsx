import React, { useState } from 'react';
import { MdClose, MdExpandMore, MdExpandLess } from 'react-icons/md';

const LoginScreen = ({ onLogin }) => {
  const [operatorName, setOperatorName] = useState('A Edrington (A)');
  const [password, setPassword] = useState('');
  const [applicationDate, setApplicationDate] = useState('7/26/2025');
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [database, setDatabase] = useState('Impromed');
  const [business, setBusiness] = useState('Granby Veterinary Hospital');
  const [desktop, setDesktop] = useState('Betsy');

  const operatorOptions = [
    'A Edrington (A)',
    'B Thompson (B)',
    'C Wilson (C)',
    'D Martinez (D)'
  ];

  const businessOptions = [
    'Granby Veterinary Hospital',
    'City Animal Clinic',
    'Pet Care Center',
    'Veterinary Associates'
  ];

  const desktopOptions = [
    'Betsy',
    'Reception',
    'Doctor1',
    'Doctor2'
  ];

  const handleLogin = () => {
    if (password.trim()) {
      onLogin();
    }
  };

  const handleCancel = () => {
    // In a real app, this might redirect or close the application
    console.log('Login cancelled');
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        {/* Title Bar */}
        <div className="login-title-bar">
          <div className="title-left">
            <span className="app-icon">🏥</span>
            <span className="title-text">Impromed Login</span>
          </div>
          <button className="title-close-btn">
            <MdClose size={14} />
          </button>
        </div>

        {/* Login Form */}
        <div className="login-content">
          <div className="login-form">
            {/* Operator Name */}
            <div className="form-row">
              <label className="form-label">Operator Name:</label>
              <select 
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="form-select operator-select"
              >
                {operatorOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button className="login-ok-btn" onClick={handleLogin}>
                OK
              </button>
            </div>

            {/* Password */}
            <div className="form-row">
              <label className="form-label">Password:</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input password-input"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button className="login-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>

            {/* Application Date */}
            <div className="form-row">
              <label className="form-label">Application Date:</label>
              <div className="date-input-container">
                <input 
                  type="text"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  className="form-input date-input"
                />
                <div className="date-spinner">
                  <button className="spinner-btn">
                    <MdExpandLess size={12} />
                  </button>
                  <button className="spinner-btn">
                    <MdExpandMore size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="advanced-toggle">
              <button 
                className="toggle-btn"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <span className="toggle-icon">{showAdvanced ? '∧' : '∨'}</span>
                <span className="toggle-text">Hide Advanced Options</span>
              </button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="advanced-options">
                {/* Database */}
                <div className="form-row">
                  <label className="form-label">Database:</label>
                  <select 
                    value={database}
                    onChange={(e) => setDatabase(e.target.value)}
                    className="form-select"
                  >
                    <option value="Impromed">Impromed</option>
                    <option value="Backup">Backup</option>
                    <option value="Test">Test</option>
                  </select>
                </div>

                {/* Database Info */}
                <div className="db-info">
                  <span className="db-size">Database Size: 72369.31 MB</span>
                  <span className="user-mode">Single User Mode: Off</span>
                </div>

                {/* Business */}
                <div className="form-row">
                  <label className="form-label">Business:</label>
                  <select 
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    className="form-select"
                  >
                    {businessOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Desktop */}
                <div className="form-row">
                  <label className="form-label">Desktop:</label>
                  <select 
                    value={desktop}
                    onChange={(e) => setDesktop(e.target.value)}
                    className="form-select"
                  >
                    {desktopOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen; 