import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePIMS } from '../../../context/PIMSContext';
import {
    MdPersonOutline, MdCalendarToday, MdNoteAlt, MdMedicalServices,
    MdReceiptLong, MdFolderOpen, MdInventory2, MdMessage,
    MdMedication, MdInsights, MdMenu, MdSearch, MdNotifications,
    MdAccountCircle, MdLogout
} from 'react-icons/md';
import { createPIMSUrl } from '../../../utils/urlUtils';

const EasyVetLayout = ({ children }) => {
    const { config } = usePIMS();
    const navigate = useNavigate();
    const location = useLocation();
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const navigationItems = [
        {
            label: config.screenLabels.checkin,
            icon: MdPersonOutline,
            path: "/",
        },
        {
            label: config.screenLabels.scheduler,
            icon: MdCalendarToday,
            path: "/scheduler",
        },
        {
            label: config.screenLabels.records,
            icon: MdFolderOpen,
            path: "/records",
        },
        {
            label: config.screenLabels.communications,
            icon: MdMessage,
            path: "/communications",
        },
        {
            label: "More",
            icon: MdMenu,
            path: null,
            subItems: [
                {
                    label: config.screenLabels.notes,
                    icon: MdNoteAlt,
                    path: "/notes",
                    enabled: true
                },
                {
                    label: config.screenLabels.services,
                    icon: MdMedicalServices,
                    path: "/services",
                    enabled: true
                },
                {
                    label: config.screenLabels.invoices,
                    icon: MdReceiptLong,
                    path: "/invoices",
                    enabled: true
                },
                {
                    label: config.screenLabels.inventory,
                    icon: MdInventory2,
                    path: "/inventory",
                    enabled: true
                },
                {
                    label: config.screenLabels.pharmacy,
                    icon: MdMedication,
                    path: "/pharmacy",
                    enabled: true
                },
                {
                    label: config.screenLabels.reports,
                    icon: MdInsights,
                    path: "/reports",
                    enabled: true
                },
            ]
        }
    ];

    // Add a function to check if a path is a functional route
    const isValidPath = (path) => {
        if (!path) return false;

        // List of implemented paths
        const implementedPaths = [
            '/',
            '/scheduler',
            '/notes',
            '/services',
            '/invoices',
            '/records',
            '/inventory',
            '/communications',
            '/pharmacy',
            '/reports'
        ];

        return implementedPaths.includes(path);
    };

    // Update the handleNavigate function to check if a path is valid
    const handleNavigate = (path) => {
        if (path === null || path === undefined || !isValidPath(path)) {
            return;
        }
        navigate(createPIMSUrl('easyvet', path));
    };

    // Determine if a nav item is active, either directly or as a submenu item
    const isActive = (item) => {
        if (item.path && location.pathname === createPIMSUrl('easyvet', item.path)) {
            return true;
        }
        if (item.subItems) {
            return item.subItems.some(subItem =>
                subItem.path && location.pathname === createPIMSUrl('easyvet', subItem.path)
            );
        }
        return false;
    };

    // Get the current screen title based on the active path
    const getCurrentScreenTitle = () => {
        if (isActive({ path: '/' })) return config.screenLabels.checkin;
        if (isActive({ path: '/scheduler' })) return config.screenLabels.scheduler;
        if (isActive({ path: '/notes' })) return config.screenLabels.notes;
        if (isActive({ path: '/services' })) return config.screenLabels.services;
        if (isActive({ path: '/invoices' })) return config.screenLabels.invoices;
        if (isActive({ path: '/records' })) return config.screenLabels.records;
        if (isActive({ path: '/inventory' })) return config.screenLabels.inventory;
        if (isActive({ path: '/communications' })) return config.screenLabels.communications;
        if (isActive({ path: '/pharmacy' })) return config.screenLabels.pharmacy;
        if (isActive({ path: '/reports' })) return config.screenLabels.reports;
        return 'easyVet';
    };

    // Handle clicking outside to close the more menu
    const handleOutsideClick = () => {
        if (showMoreMenu) {
            setShowMoreMenu(false);
        }
    };

    return (
        <div className="layout-card-based pims-easyvet" onClick={handleOutsideClick}>
            <div
                style={{
                    margin: '0',
                    padding: '0',
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--background-color)',
                    fontFamily: 'var(--font-family)',
                    color: 'var(--text-color)',
                    overflow: 'hidden'
                }}
            >
                {/* Top Navigation Bar */}
                <header
                    style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '12px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>easyVet</span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            width: '200px'
                        }}>
                            <MdSearch color="white" size={20} style={{ marginRight: '8px' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'white',
                                    outline: 'none',
                                    width: '100%',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <MdNotifications size={24} style={{ cursor: 'pointer' }} />
                        <MdAccountCircle size={24} style={{ cursor: 'pointer' }} />
                    </div>
                </header>

                {/* Main Content */}
                <main
                    style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '20px',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    <div className="card" style={{
                        backgroundColor: 'white',
                        borderRadius: 'var(--border-radius)',
                        boxShadow: 'var(--card-shadow)',
                        padding: '20px',
                        height: 'calc(100% - 40px)',
                        overflow: 'auto'
                    }}>
                        {/* Page Title */}
                        <h1 style={{
                            color: 'var(--primary-color)',
                            fontSize: '20px',
                            fontWeight: '500',
                            margin: '0 0 20px 0',
                            padding: '0 0 10px 0',
                            borderBottom: '2px solid var(--secondary-color)'
                        }}>
                            {getCurrentScreenTitle()}
                        </h1>

                        {children}
                    </div>
                </main>

                {/* Bottom Navigation */}
                <nav
                    className="bottom-nav"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        backgroundColor: 'white',
                        padding: '8px 0',
                        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
                        position: 'relative',
                        zIndex: 5
                    }}
                >
                    {navigationItems.map((item, idx) => {
                        const active = isActive(item);
                        const Icon = item.icon;
                        const isMoreButton = item.label === "More";

                        return (
                            <div
                                key={idx}
                                className={`nav-item ${active ? 'active' : ''}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                    color: active ? 'var(--primary-color)' : 'var(--text-color)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    padding: '4px 0'
                                }}
                                onClick={() => isMoreButton ? setShowMoreMenu(!showMoreMenu) : handleNavigate(item.path)}
                            >
                                <Icon size={24} />
                                <span style={{ fontSize: '12px', marginTop: '4px' }}>{item.label}</span>

                                {/* Active indicator line */}
                                {active && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-8px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '40px',
                                        height: '3px',
                                        backgroundColor: 'var(--primary-color)',
                                        borderRadius: '2px'
                                    }} />
                                )}

                                {/* More menu dropdown */}
                                {isMoreButton && showMoreMenu && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '200px',
                                            backgroundColor: 'white',
                                            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                                            borderRadius: '4px',
                                            padding: '8px 0',
                                            zIndex: 100
                                        }}
                                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                    >
                                        {item.subItems.map((subItem, sIdx) => {
                                            const SubIcon = subItem.icon;
                                            const isSubActive = location.pathname === createPIMSUrl('easyvet', subItem.path);

                                            return (
                                                <div
                                                    key={sIdx}
                                                    className={`submenu-item ${isSubActive ? 'active' : ''}`}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        padding: '10px 16px',
                                                        color: isSubActive ? 'var(--primary-color)' : (isValidPath(subItem.path) ? 'var(--text-color)' : 'rgba(0,0,0,0.5)'),
                                                        backgroundColor: isSubActive ? 'var(--secondary-color)' : 'transparent',
                                                        cursor: isValidPath(subItem.path) ? 'pointer' : 'default',
                                                        borderRadius: '4px',
                                                        opacity: isValidPath(subItem.path) ? 1 : 0.7
                                                    }}
                                                    onClick={(e) => {
                                                        if (isValidPath(subItem.path)) {
                                                            e.stopPropagation();
                                                            navigate(createPIMSUrl('easyvet', subItem.path));
                                                            setShowMoreMenu(false);
                                                        }
                                                    }}
                                                >
                                                    <SubIcon size={20} />
                                                    <span>
                                                        {subItem.label}
                                                        {!isValidPath(subItem.path) && " (Coming Soon)"}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default EasyVetLayout; 