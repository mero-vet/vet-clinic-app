import React, { useState, useRef, useEffect } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

const CovetrusDropdownMenu = ({ isOpen, onClose, triggerRef }) => {
  const [currentLevel, setCurrentLevel] = useState('main'); // 'main' or 'modules'
  const [expandedMenus, setExpandedMenus] = useState({});
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const menuRef = useRef(null);

  // Main dropdown menu items (first level)
  const mainMenuItems = [
    {
      id: 'file',
      label: 'File',
      icon: '📄',
      submenu: []
    },
    {
      id: 'view',
      label: 'View',
      icon: '👁️',
      submenu: []
    },
    {
      id: 'modules',
      label: 'Modules',
      icon: '🧩',
      submenu: [],
      hasSubmenu: true
    },
    {
      id: 'invoice',
      label: 'Invoice',
      icon: '🧾',
      submenu: []
    },
    {
      id: 'database',
      label: 'Database',
      icon: '🗄️',
      submenu: []
    },
    {
      id: 'setup',
      label: 'Setup',
      icon: '⚙️',
      submenu: []
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: '🔧',
      submenu: []
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: '📞',
      submenu: []
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      submenu: []
    },
    {
      id: 'email',
      label: 'Email Client',
      icon: '📧',
      submenu: []
    },
    {
      id: 'time',
      label: 'Time Clock',
      icon: '🕒',
      submenu: []
    },
    {
      id: 'impromed',
      label: 'Impromed VPR Dosage Calculator',
      icon: '💊',
      submenu: []
    }
  ];

  // Modules submenu items (second level)
  const moduleItems = [
    {
      id: 'accounts',
      label: 'Accounts Receivable',
      icon: '💰',
      submenu: []
    },
    {
      id: 'boarding',
      label: 'Boarding',
      icon: '🏠',
      submenu: []
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: '📜',
      submenu: []
    },
    {
      id: 'clinic',
      label: 'Clinic Census',
      icon: '🏥',
      submenu: []
    },
    {
      id: 'communications',
      label: 'Communication History',
      icon: '📞',
      submenu: []
    },
    {
      id: 'database',
      label: 'Database',
      icon: '🗄️',
      submenu: []
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: '📄',
      submenu: []
    },
    {
      id: 'episodes',
      label: 'Episodes Of Care',
      icon: '🔄',
      submenu: []
    },
    {
      id: 'estimates',
      label: 'Estimates',
      icon: '📊',
      submenu: []
    },
    {
      id: 'general',
      label: 'General Ledger Link',
      icon: '🔗',
      submenu: []
    },
    {
      id: 'global',
      label: 'GlobalVetLink Web Service',
      icon: '🌐',
      submenu: []
    },
    {
      id: 'imageviewer',
      label: 'Image Viewer',
      icon: '🖼️',
      submenu: []
    },
    {
      id: 'infocenter',
      label: 'InfoCenter',
      icon: 'ℹ️',
      submenu: []
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: '📦',
      submenu: []
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: '🧾',
      submenu: []
    },
    {
      id: 'lab',
      label: 'Lab Integrations',
      icon: '🧪',
      submenu: []
    },
    {
      id: 'labels',
      label: 'Labels',
      icon: '🏷️',
      submenu: []
    },
    {
      id: 'medical',
      label: 'Medical Records',
      icon: '📋',
      submenu: [],
      highlighted: true
    },
    {
      id: 'message',
      label: 'Message Center',
      icon: '💬',
      submenu: []
    },
    {
      id: 'processing',
      label: 'Patient Processing',
      icon: '👥',
      submenu: []
    },
    {
      id: 'pedigree',
      label: 'Pedigree',
      icon: '🐕',
      submenu: []
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      icon: '💊',
      submenu: []
    },
    {
      id: 'process',
      label: 'Process Management',
      icon: '⚙️',
      submenu: []
    },
    {
      id: 'rechecks',
      label: 'Rechecks',
      icon: '🔄',
      submenu: []
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📈',
      submenu: []
    },
    {
      id: 'reportsenhanced',
      label: 'Reports (Enhanced)',
      icon: '📊',
      submenu: []
    },
    {
      id: 'scheduled',
      label: 'Scheduled Payments',
      icon: '💳',
      submenu: []
    },
    {
      id: 'scheduler',
      label: 'Scheduler',
      icon: '📅',
      submenu: []
    },
    {
      id: 'stable',
      label: 'Stable/Trainer Invoices',
      icon: '🐎',
      submenu: []
    },
    {
      id: 'status',
      label: 'Status Notes',
      icon: '📝',
      submenu: []
    },
    {
      id: 'takehome',
      label: 'Take Home Instructions',
      icon: '📋',
      submenu: []
    },
    {
      id: 'time',
      label: 'Time Management',
      icon: '⏰',
      submenu: []
    },
    {
      id: 'transaction',
      label: 'Transaction Corrections',
      icon: '✏️',
      submenu: []
    },
    {
      id: 'travel',
      label: 'Travel Sheets',
      icon: '🚗',
      submenu: []
    },
    {
      id: 'treatment',
      label: 'Treatment Plans',
      icon: '📋',
      submenu: []
    },
    {
      id: 'vetconnect',
      label: 'VetConnect PLUS',
      icon: '🔌',
      submenu: []
    },
    {
      id: 'wellness',
      label: 'Wellness Plans',
      icon: '💚',
      submenu: []
    }
  ];

  const handleMenuClick = (menuId) => {
    if (menuId === 'modules') {
      setCurrentLevel('modules');
    } else if (currentLevel === 'modules') {
      // Handle module item clicks
      if (menuId === 'medical') {
        // Open Medical Records view
        window.dispatchEvent(new CustomEvent('openMedicalRecords'));
        onClose();
      } else {
        console.log('Module clicked:', menuId);
      }
    } else {
      // Handle other main menu clicks
      console.log('Menu clicked:', menuId);
    }
  };

  const goBackToMain = () => {
    setCurrentLevel('main');
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleMenuHover = (menuId) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    if (menuId === 'modules') {
      setCurrentLevel('modules');
    }
  };

  const handleMenuLeave = () => {
    // Set a timeout to return to main menu after a short delay
    const timeout = setTimeout(() => {
      setCurrentLevel('main');
    }, 200); // 200ms delay before hiding submenu

    setHoverTimeout(timeout);
  };

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Reset to main level when menu opens
  useEffect(() => {
    if (isOpen) {
      setCurrentLevel('main');
      setExpandedMenus({});
    }
  }, [isOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
        triggerRef.current && !triggerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Handle Escape key
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

  const currentItems = currentLevel === 'main' ? mainMenuItems : moduleItems;
  const menuTitle = currentLevel === 'main' ? 'Covetrus Menu' : 'Modules';

  return (
    <div className="covetrus-dropdown-overlay">
      <div className="covetrus-dropdown-container" ref={menuRef}>
        {/* Main Menu */}
        <div
          className="covetrus-dropdown-menu main-menu"
          onMouseEnter={() => {
            // Clear any timeout when entering main menu
            if (hoverTimeout) {
              clearTimeout(hoverTimeout);
              setHoverTimeout(null);
            }
          }}
        >
          <div className="menu-header">
            <span className="menu-title">Covetrus Menu</span>
          </div>
          <div className="menu-items">
            {mainMenuItems.map((item) => (
              <div key={item.id} className="menu-item-container">
                <div
                  className={`menu-item ${item.highlighted ? 'highlighted' : ''}`}
                  onClick={() => {
                    if (item.hasSubmenu) {
                      handleMenuClick(item.id);
                    } else if (item.submenu.length > 0) {
                      toggleSubmenu(item.id);
                    } else {
                      handleMenuClick(item.id);
                    }
                  }}
                  onMouseEnter={() => {
                    if (item.hasSubmenu) {
                      handleMenuHover(item.id);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasSubmenu) {
                      handleMenuLeave();
                    }
                  }}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                  {(item.hasSubmenu || item.submenu.length > 0) && (
                    <span className="menu-arrow">
                      {item.hasSubmenu ? '→' : (expandedMenus[item.id] ? <MdExpandLess size={12} /> : <MdExpandMore size={12} />)}
                    </span>
                  )}
                </div>
                {item.submenu.length > 0 && expandedMenus[item.id] && (
                  <div className="submenu">
                    {item.submenu.map((subItem, index) => (
                      <div key={index} className="submenu-item">
                        <span className="submenu-icon">{subItem.icon}</span>
                        <span className="submenu-label">{subItem.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modules Submenu (side-by-side) */}
        {currentLevel === 'modules' && (
          <div
            className="covetrus-dropdown-menu submenu-panel"
            onMouseEnter={() => {
              // Clear any timeout when entering submenu
              if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                setHoverTimeout(null);
              }
            }}
            onMouseLeave={() => {
              // Set timeout to close submenu when leaving
              handleMenuLeave();
            }}
          >
            <div className="menu-header">
              <span className="menu-title">Modules</span>
            </div>
            <div className="menu-items">
              {moduleItems.map((item) => (
                <div key={item.id} className="menu-item-container">
                  <div
                    className={`menu-item ${item.highlighted ? 'highlighted' : ''}`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CovetrusDropdownMenu; 