import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePIMS } from '../../../context/PIMSContext';
import {
    MdPersonOutline, MdCalendarToday, MdNoteAlt, MdMedicalServices,
    MdReceiptLong, MdFolderOpen, MdInventory2, MdMessage,
    MdMedication, MdInsights, MdSearch, MdNotifications,
    MdAccountCircle, MdHelp, MdAdd, MdKeyboardArrowDown,
    MdMenu, MdMoreVert, MdSettings
} from 'react-icons/md';
import { createPIMSUrl } from '../../../utils/urlUtils';

const CovetrusLayout = ({ children }) => {
    const { config } = usePIMS();
    const navigate = useNavigate();
    const location = useLocation();
    const [openMegaMenu, setOpenMegaMenu] = useState(null);

    // Close the mega menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMegaMenu(null);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Mega menu structure with "Coming Soon" labels
    const megaMenus = [
        {
            id: 'patients',
            label: 'Patients',
            items: [
                {
                    title: 'Patient Flow',
                    items: [
                        { label: config.screenLabels.checkin, path: '/' },
                        { label: 'Patient Search (Coming Soon)', path: null },
                        { label: 'New Patient (Coming Soon)', path: null }
                    ]
                },
                {
                    title: 'Client Management',
                    items: [
                        { label: config.screenLabels.communications, path: '/communications' },
                        { label: 'Client Portal (Coming Soon)', path: null },
                        { label: 'Reminders (Coming Soon)', path: null }
                    ]
                }
            ]
        },
        {
            id: 'appointments',
            label: 'Appointments',
            items: [
                {
                    title: 'Scheduling',
                    items: [
                        { label: config.screenLabels.scheduler, path: '/scheduler' },
                        { label: 'Calendar View (Coming Soon)', path: null },
                        { label: 'Resource Management (Coming Soon)', path: null }
                    ]
                },
                {
                    title: 'Clinical',
                    items: [
                        { label: config.screenLabels.notes, path: '/notes' },
                        { label: config.screenLabels.services, path: '/services' },
                        { label: 'Admission Forms (Coming Soon)', path: null }
                    ]
                }
            ]
        },
        {
            id: 'medicalRecords',
            label: 'Medical Records',
            items: [
                {
                    title: 'Health Hub',
                    items: [
                        { label: config.screenLabels.records, path: '/records' },
                        { label: 'Lab Results (Coming Soon)', path: null },
                        { label: 'Imaging (Coming Soon)', path: null }
                    ]
                },
                {
                    title: 'Prescriptions',
                    items: [
                        { label: config.screenLabels.pharmacy, path: '/pharmacy' },
                        { label: 'Refill Requests (Coming Soon)', path: null },
                        { label: 'Compounding (Coming Soon)', path: null }
                    ]
                }
            ]
        },
        {
            id: 'financial',
            label: 'Financial',
            items: [
                {
                    title: 'Transactions',
                    items: [
                        { label: config.screenLabels.invoices, path: '/invoices' },
                        { label: 'Payments (Coming Soon)', path: null },
                        { label: 'Insurance Claims (Coming Soon)', path: null }
                    ]
                },
                {
                    title: 'Reporting',
                    items: [
                        { label: config.screenLabels.reports, path: '/reports' },
                        { label: 'Financial Dashboards (Coming Soon)', path: null },
                        { label: 'Exports (Coming Soon)', path: null }
                    ]
                }
            ]
        },
        {
            id: 'inventory',
            label: 'Inventory',
            items: [
                {
                    title: 'Stock Management',
                    items: [
                        { label: config.screenLabels.inventory, path: '/inventory' },
                        { label: 'Orders (Coming Soon)', path: null },
                        { label: 'Suppliers (Coming Soon)', path: null }
                    ]
                },
                {
                    title: 'Product Catalog',
                    items: [
                        { label: 'Catalog Management (Coming Soon)', path: null },
                        { label: 'Price Lists (Coming Soon)', path: null },
                        { label: 'Integrations (Coming Soon)', path: null }
                    ]
                }
            ]
        }
    ];

    // Quick actions with "Coming Soon" labels for non-functional items
    const quickActions = [
        { label: 'New Patient (Coming Soon)', icon: MdAdd, color: '#6200EA' },
        { label: 'New Appointment (Coming Soon)', icon: MdCalendarToday, color: '#00BFA5' },
        { label: 'New Invoice (Coming Soon)', icon: MdReceiptLong, color: '#FFC107' },
        { label: 'New Prescription (Coming Soon)', icon: MdMedication, color: '#FF5722' }
    ];

    // Toggle mega menu
    const toggleMegaMenu = (menuId, event) => {
        event.stopPropagation(); // Prevent the document click handler from immediately closing the menu

        if (openMegaMenu === menuId) {
            setOpenMegaMenu(null);
        } else {
            setOpenMegaMenu(menuId);
        }
    };

    // Navigate to path
    const handleNavigate = (path) => {
        if (path === null || path === undefined) {
            return;
        }
        navigate(createPIMSUrl('covetrus', path));
    };

    // Check if a navigation item is active
    const isActive = (path) => {
        if (path === null || path === undefined) {
            return false;
        }
        return location.pathname === createPIMSUrl('covetrus', path);
    };

    // Check if a menu contains the current path
    const isMenuActive = (menu) => {
        for (const section of menu.items) {
            for (const item of section.items) {
                if (item.path && location.pathname === createPIMSUrl('covetrus', item.path)) {
                    return true;
                }
            }
        }
        return false;
    };

    return (
        <div className="layout-modern-saas pims-covetrus">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    backgroundColor: 'var(--background-color)',
                    fontFamily: 'var(--font-family)',
                    color: 'var(--text-color)',
                    overflow: 'hidden'
                }}
            >
                {/* Top Navigation Bar */}
                <header
                    style={{
                        backgroundColor: 'white',
                        borderBottom: '1px solid var(--border-color)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        padding: '0 24px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 1000,
                        position: 'relative'
                    }}
                >
                    {/* Logo and left section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--primary-color)' }}>
                            Covetrus Pulse
                        </div>

                        {/* Main navigation */}
                        <nav style={{ display: 'flex', gap: '4px' }}>
                            {megaMenus.map(menu => {
                                const isActive = openMegaMenu === menu.id || isMenuActive(menu);

                                return (
                                    <div
                                        key={menu.id}
                                        style={{
                                            padding: '8px 16px',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: isActive ? 600 : 400,
                                            color: isActive ? 'var(--primary-color)' : 'inherit',
                                            borderBottom: isActive ? `2px solid var(--primary-color)` : '2px solid transparent'
                                        }}
                                        onClick={(e) => toggleMegaMenu(menu.id, e)}
                                    >
                                        {menu.label}
                                        <MdKeyboardArrowDown size={18} style={{ marginLeft: '4px' }} />

                                        {/* Mega menu dropdown */}
                                        {openMegaMenu === menu.id && (
                                            <div
                                                className="mega-menu"
                                                style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    width: '600px',
                                                    backgroundColor: 'white',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                                    borderRadius: '8px',
                                                    padding: '16px',
                                                    display: 'flex',
                                                    gap: '24px',
                                                    zIndex: 1000
                                                }}
                                                onClick={(e) => e.stopPropagation()} // Prevent clicking inside the menu from closing it
                                            >
                                                {menu.items.map((section, idx) => (
                                                    <div key={idx} style={{ flex: 1 }}>
                                                        <h3 className="mega-menu-header" style={{
                                                            margin: '0 0 12px 0',
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px',
                                                            color: 'var(--mega-menu-header)'
                                                        }}>
                                                            {section.title}
                                                        </h3>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                            {section.items.map((item, i) => {
                                                                const isItemActive = item.path === location.pathname;

                                                                return (
                                                                    <div
                                                                        key={i}
                                                                        style={{
                                                                            padding: '8px 12px',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer',
                                                                            color: item.path ? (isItemActive ? 'var(--primary-color)' : 'var(--text-color)') : 'var(--text-color)',
                                                                            backgroundColor: isItemActive ? 'var(--secondary-color)' : 'transparent',
                                                                            opacity: item.path ? 1 : 0.6
                                                                        }}
                                                                        onClick={(e) => handleNavigate(item.path)}
                                                                    >
                                                                        {item.label}
                                                                        {!item.path && <span style={{ fontSize: '10px', marginLeft: '5px' }}>(Coming Soon)</span>}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* User controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            backgroundColor: 'var(--background-color)',
                            padding: '8px 12px',
                            borderRadius: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            width: '200px'
                        }}>
                            <MdSearch size={20} style={{ color: 'var(--text-color)', opacity: 0.7, marginRight: '8px' }} />
                            <input
                                type="text"
                                placeholder="Global Search..."
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    outline: 'none',
                                    fontSize: '14px',
                                    width: '100%',
                                    color: 'var(--text-color)'
                                }}
                            />
                        </div>

                        <MdNotifications size={22} style={{ cursor: 'pointer' }} />
                        <MdHelp size={22} style={{ cursor: 'pointer' }} />
                        <MdSettings size={22} style={{ cursor: 'pointer' }} />

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            borderRadius: '100px',
                            transition: 'background-color 0.2s'
                        }}>
                            <MdAccountCircle size={32} style={{ color: 'var(--primary-color)' }} />
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>Dr. Smith</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main
                    style={{
                        flex: 1,
                        padding: '24px',
                        overflow: 'auto',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    {/* Page header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <h1 style={{
                            margin: 0,
                            fontSize: '24px',
                            fontWeight: 600,
                            color: 'var(--text-color)'
                        }}>
                            {(() => {
                                // Determine page title based on current path using our isActive helper
                                if (isActive('/')) return config.screenLabels.checkin;
                                if (isActive('/scheduler')) return config.screenLabels.scheduler;
                                if (isActive('/notes')) return config.screenLabels.notes;
                                if (isActive('/services')) return config.screenLabels.services;
                                if (isActive('/invoices')) return config.screenLabels.invoices;
                                if (isActive('/records')) return config.screenLabels.records;
                                if (isActive('/inventory')) return config.screenLabels.inventory;
                                if (isActive('/communications')) return config.screenLabels.communications;
                                if (isActive('/pharmacy')) return config.screenLabels.pharmacy;
                                if (isActive('/reports')) return config.screenLabels.reports;
                                return 'Dashboard';
                            })()}
                        </h1>

                        {/* Quick actions */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {quickActions.map((action, idx) => {
                                const ActionIcon = action.icon;
                                return (
                                    <button
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 16px',
                                            backgroundColor: 'white',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            color: 'var(--text-color)',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <ActionIcon size={18} style={{ color: action.color }} />
                                        {action.label}
                                    </button>
                                );
                            })}

                            <button
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'white',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                }}
                            >
                                <MdMoreVert size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content card */}
                    <div className="card"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 'var(--border-radius)',
                            boxShadow: 'var(--card-shadow)',
                            padding: '24px',
                            height: 'calc(100% - 80px)', // Account for page header
                            overflow: 'auto'
                        }}
                    >
                        {children}
                    </div>
                </main>

                {/* Floating action button */}
                <div
                    className="floating-button"
                    style={{
                        position: 'fixed',
                        right: '24px',
                        bottom: '24px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--floating-button-bg)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--floating-button-shadow)',
                        cursor: 'pointer',
                        zIndex: 1000
                    }}
                >
                    <MdAdd size={24} />
                </div>
            </div>
        </div>
    );
};

export default CovetrusLayout; 