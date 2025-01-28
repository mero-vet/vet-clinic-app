import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PatientProvider } from './context/PatientContext';
import PatientCheckin from './components/PatientCheckin';
import PatientVisitList from './components/PatientVisitList';
import './styles/PatientForms.css';
import './styles/WindowsClassic.css';

function App() {
  // Simple data model for menu items and sub-menu items
  const menuItems = [
    {
      label: 'File',
      subItems: ['Open', 'Close', 'Exit'],
    },
    {
      label: 'Edit',
      subItems: ['Undo', 'Redo', 'Preferences'],
    },
    {
      label: 'Activities',
      subItems: ['Activity A', 'Activity B', 'Activity C'],
    },
    {
      label: 'Lists',
      subItems: ['List 1', 'List 2', 'List 3'],
    },
    {
      label: 'Controls',
      subItems: ['Control 1', 'Control 2', 'Control 3'],
    },
    {
      label: 'Inventory',
      subItems: ['Stock Items', 'Reorder', 'Vendors'],
    },
    {
      label: 'Tools',
      subItems: ['Tool A', 'Tool B', 'Tool C'],
    },
    {
      label: 'Reports',
      subItems: ['Daily Report', 'Monthly Report', 'Yearly Report'],
    },
    {
      label: 'Web Links',
      subItems: ['Link A', 'Link B', 'Link C'],
    },
    {
      label: 'Window',
      subItems: ['Cascade', 'Tile', 'Close All'],
    },
    {
      label: 'Help',
      subItems: ['Help Contents', 'About', 'Check for Updates'],
    },
  ];

  // Track which menu is active on hover
  const [activeMenu, setActiveMenu] = useState(null);

  // Hard-coded icons and their labels (updated first icon URL)
  const iconData = [
    {
      label: 'Appointments',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4288/4288956.png', // different version
      hoverText: 'Manage appointments',
    },
    {
      label: 'Invoices',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3416/3416377.png',
      hoverText: 'Handle invoices & payments',
    },
    {
      label: 'Patient Records',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2462/2462719.png',
      hoverText: 'View or edit patient records',
    },
    {
      label: 'Lab Orders',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2991/2991133.png',
      hoverText: 'Create or update lab orders',
    },
    {
      label: 'Pharmacy',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2630/2630054.png',
      hoverText: 'Access pharmacy interface',
    },
    {
      label: 'Payments',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/929/929422.png',
      hoverText: 'Process client payments',
    },
    {
      label: 'Check-In/Out',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828959.png',
      hoverText: 'Check patients in or out',
    },
    {
      label: 'Notes',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1250/1250689.png',
      hoverText: 'Create or read notes',
    },
    {
      label: 'Reminders',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830308.png',
      hoverText: 'Manage reminders',
    },
    {
      label: 'Reports',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3416/3416021.png',
      hoverText: 'Generate various reports',
    },
  ];

  return (
    <PatientProvider>
      {/* Parent Window (Windows Classic style) */}
      <div
        className="window"
        style={{
          margin: '0', // remove auto centering
          padding: '4px', // minimal overall padding
          width: '100%',
          maxWidth: 'none',
        }}
      >
        <div className="title-bar">
          <div className="title-bar-text">Cornerstone</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div
          className="window-body"
          style={{
            padding: '4px', // minimal padding
          }}
        >
          {/* Main menu bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#c0c0c0',
              border: '2px solid #404040',
              padding: '4px',
              marginBottom: '4px',
            }}
          >
            <ul
              style={{
                display: 'flex',
                listStyle: 'none',
                gap: '10px',
                margin: 0,
                padding: 0,
                position: 'relative',
              }}
            >
              {menuItems.map((menu, idx) => (
                <li
                  key={idx}
                  style={{
                    position: 'relative',
                    padding: '0 6px',
                    cursor: 'pointer',
                    color: 'black', // updated text color
                  }}
                  onMouseEnter={() => setActiveMenu(idx)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {menu.label}
                  {activeMenu === idx && (
                    <ul
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: '#c0c0c0',
                        border: '2px solid #404040',
                        listStyle: 'none',
                        padding: '4px 0',
                        margin: 0,
                        minWidth: '120px',
                        zIndex: 10,
                      }}
                    >
                      {menu.subItems.map((sub, sIdx) => (
                        <li
                          key={sIdx}
                          style={{
                            padding: '4px 8px',
                            color: 'black', // sub-menu text color
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseDown={(e) => {
                            // No real action, just a placeholder
                            e.stopPropagation();
                          }}
                        >
                          {sub}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Icon bar with 10 placeholders */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {iconData.map((iconItem, idx) => (
              <button
                key={idx}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #404040',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eee';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                title={iconItem.hoverText || iconItem.label}
              >
                <img
                  src={iconItem.iconUrl}
                  alt={iconItem.label}
                  style={{ width: '20px', height: '20px' }}
                />
              </button>
            ))}
          </div>

          {/* Nested "window-body" where the routes display */}
          <div
            className="window-body"
            style={{
              padding: '4px',
            }}
          >
            <Router>
              <Routes>
                <Route path="/" element={<PatientCheckin />} />
                <Route path="/visit-list" element={<PatientVisitList />} />
              </Routes>
            </Router>
          </div>
        </div>
      </div>
    </PatientProvider>
  );
}

export default App;