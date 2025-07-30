import React from 'react';
import PropTypes from 'prop-types';
import { useMenu } from '../context/MenuContext';

/**
 * MenuBar - Excel-style menu bar with nine labels
 * Styled to match Impromed Infinity's Windows Forms appearance
 */
const MenuBar = () => {
  const { activeMenu, setActiveMenu } = useMenu();

  const menuItems = [
    { label: 'Home', key: 'H', id: 'home', onClick: () => setActiveMenu('home') },
    { label: 'Invoicing', key: 'I', id: 'invoicing', onClick: () => setActiveMenu('invoicing') },
    { label: 'Customers', key: 'C', id: 'customers', onClick: () => setActiveMenu('customers') },
    { label: 'Medical Records', key: 'M', id: 'medicalrecords', onClick: () => setActiveMenu('medicalrecords') },
    { label: 'Scheduling', key: 'S', id: 'scheduling', onClick: () => setActiveMenu('scheduling') },
    { label: 'Communications', key: 'o', id: 'communications', onClick: () => setActiveMenu('communications') },
    { label: 'Business', key: 'B', id: 'business', onClick: () => setActiveMenu('business') },
    { label: 'Tools', key: 'T', id: 'tools', onClick: () => setActiveMenu('tools') },
    { label: 'Help', key: 'e', id: 'help', onClick: () => setActiveMenu('help') },
              { label: 'Group Chat', key: 'G', id: 'groupchat', onClick: () => setActiveMenu('groupchat') },
          { label: 'Test Modal', key: 'T', id: 'testmodal', onClick: () => window.dispatchEvent(new CustomEvent('openTestModal')) },
        ];



  return (
    <div className="impromed-menu-bar">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
          }}
          role="menuitem"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              item.onClick();
            }
          }}
        >
          {item.label.split(item.key).map((part, i) => 
            i === 0 ? (
              <span key={i}>
                {part}
                <span className="mnemonic-underline">{item.key}</span>
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;
