import React, { useState } from 'react';
import {
  MdSearch, MdMap, MdStorage, MdReceipt, MdLock, MdRefresh, MdHistory, MdAssignment,
  MdFileDownload, MdInfo, MdLabel, MdPrint, MdSchedule, MdSort, MdMail, MdPostAdd,
  MdHome, MdPerson, MdCalendarToday, MdBusiness, MdBuild, MdHelp, MdChat, MdFolder,
  MdAdd, MdEdit, MdPhone, MdEmail, MdNotifications, MdDescription, MdFindInPage,
  MdContactMail, MdMarkEmailRead, MdEventNote, MdLocationOn, MdPayment, MdInventory,
  MdBarChart, MdSettings, MdSync, MdQuestionAnswer, MdSupport
} from 'react-icons/md';
import { useMenu } from '../context/MenuContext';
import PerformSearchModal from './PerformSearchModal';
import PatientSearchModal from './PatientSearchModal';
import CovetrusMenuButton from './CovetrusMenuButton';

/**
 * TopMenuToolbar - The green toolbar section from Impromed Infinity
 * Contains context-sensitive buttons based on the selected menu
 */
const TopMenuToolbar = () => {
  const { activeMenu } = useMenu();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isPatientSearchOpen, setIsPatientSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Define button sets for each menu context
  const toolbarConfigs = {
    home: [
      { icon: MdHome, label: 'Dashboard' },
      { icon: MdPerson, label: 'Quick Patient' },
      { icon: MdCalendarToday, label: 'Today' },
      { icon: MdReceipt, label: 'Quick Invoice' },
    ],
    communications: [
      { icon: MdHistory, label: 'Communication History' },
      { icon: MdAssignment, label: 'Compliance Log' },
      { icon: MdFileDownload, label: 'Export Selection', onClick: () => window.dispatchEvent(new CustomEvent('openExportSelection')) },
      { icon: MdInfo, label: 'InfoCenter' },
      { icon: MdLabel, label: 'Labels' },
      { icon: MdSearch, label: 'Perform Search', highlighted: true, onClick: () => setIsSearchModalOpen(true) },
      { icon: MdPrint, label: 'Print Selected Patient Medical Records' },
      { icon: MdEventNote, label: 'Scheduled Communications' },
      { icon: MdLabel, label: 'Search and Sort Labels' },
      { icon: MdMail, label: 'Search and Sort Letters' },
      { icon: MdPostAdd, label: 'Search and Sort Post Cards' },
      { icon: MdNotifications, label: 'Search and Sort Reminders' },
    ],
    invoicing: [
      { icon: MdAdd, label: 'New Invoice' },
      { icon: MdFindInPage, label: 'Find Invoice' },
      { icon: MdPrint, label: 'Print Invoice' },
      { icon: MdPayment, label: 'Payment' },
      { icon: MdFileDownload, label: 'Export' },
    ],
    customers: [
      { icon: MdAdd, label: 'New Customer' },
      { icon: MdFindInPage, label: 'Find Customer' },
      { icon: MdPrint, label: 'Print Info' },
      { icon: MdEmail, label: 'Send Email' },
      { icon: MdPhone, label: 'Call Customer' },
    ],
    medicalrecords: [
      { icon: MdAdd, label: 'New Record' },
      { icon: MdFindInPage, label: 'Find Record' },
      { icon: MdEdit, label: 'Edit Record' },
      { icon: MdPrint, label: 'Print Record' },
      { icon: MdDescription, label: 'View Chart' },
    ],
    scheduling: [
      { icon: MdAdd, label: 'New Appointment' },
      { icon: MdFindInPage, label: 'Find Appointment' },
      { icon: MdPrint, label: 'Print Schedule' },
      { icon: MdRefresh, label: 'Refresh View' },
      { icon: MdCalendarToday, label: 'Today View' },
    ],
    business: [
      { icon: MdBarChart, label: 'Reports' },
      { icon: MdStorage, label: 'Database' },
      { icon: MdFileDownload, label: 'Export Data' },
      { icon: MdInventory, label: 'Inventory' },
    ],
    tools: [
      { icon: MdSettings, label: 'Settings' },
      { icon: MdStorage, label: 'Database Tools' },
      { icon: MdSync, label: 'Sync' },
      { icon: MdBuild, label: 'Utilities' },
    ],
    help: [
      { icon: MdHelp, label: 'Help Topics' },
      { icon: MdSupport, label: 'Support' },
      { icon: MdQuestionAnswer, label: 'FAQ' },
      { icon: MdInfo, label: 'About' },
    ],
    groupchat: [
      { icon: MdAdd, label: 'New Chat' },
      { icon: MdPerson, label: 'Participants' },
      { icon: MdHistory, label: 'Chat History' },
      { icon: MdNotifications, label: 'Notifications' },
    ]
  };

  const currentButtons = toolbarConfigs[activeMenu] || toolbarConfigs.home;
  return (
    <div className="impromed-top-toolbar">
      {/* Dynamic buttons based on active menu */}
      <div className="toolbar-buttons">
        {currentButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <button 
              key={index} 
              className={`toolbar-button ${button.highlighted ? 'highlighted' : ''}`}
              onClick={button.onClick || (() => console.log(`${button.label} clicked`))}
              title={button.label}
            >
              <Icon size={20} />
              <span>{button.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right section - Controls (always visible) */}
      <div className="toolbar-right">
        <div className="search-group">
          <label>Client Quick Search</label>
          <input 
            type="text" 
            placeholder="" 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                setIsPatientSearchOpen(true);
              }
            }}
          />
          <MdSearch className="search-icon" />
        </div>
        <div className="search-group">
          <label>Patient Quick Search</label>
          <input 
            type="text" 
            placeholder="" 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                setIsPatientSearchOpen(true);
              }
            }}
          />
          <MdSearch className="search-icon" />
        </div>
        <div className="control-group">
          <label>Operation</label>
          <select className="toolbar-select">
            <option>A Lexington (A)</option>
          </select>
        </div>
        <div className="control-group">
          <label>Provider</label>
          <select className="toolbar-select">
            <option>None</option>
          </select>
        </div>
        <button className="toolbar-button">
          <MdLock size={16} />
          <span>Lock Operation</span>
        </button>
        <div className="status-indicators">
          <div className="status-item">
            <span>Download</span>
            <span className="status-value">Busy</span>
          </div>
          <div className="location-item">
            <span>Location: ALL</span>
          </div>
        </div>
      </div>
      
      <PerformSearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      
      <PatientSearchModal 
        isOpen={isPatientSearchOpen}
        onClose={() => setIsPatientSearchOpen(false)}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default TopMenuToolbar;
