import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePIMS } from '../../../context/PIMSContext';
import {
    MdPersonOutline, MdCalendarToday, MdNoteAlt, MdMedicalServices,
    MdReceiptLong, MdFolderOpen, MdInventory2, MdMessage,
    MdMedication, MdInsights
} from 'react-icons/md';
import { createPIMSUrl } from '../../../utils/urlUtils';

const CornerstoneLayout = ({ children }) => {
    const { config } = usePIMS();
    const [activeMenu, setActiveMenu] = useState(null);
    const [hoveredIcon, setHoveredIcon] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            label: 'File',
            subItems: ['Open (Coming Soon)', 'Close (Coming Soon)', 'Exit (Coming Soon)'],
        },
        {
            label: 'Edit',
            subItems: ['Undo (Coming Soon)', 'Redo (Coming Soon)', 'Preferences (Coming Soon)'],
        },
        {
            label: 'Activities',
            subItems: ['Activity A (Coming Soon)', 'Activity B (Coming Soon)', 'Activity C (Coming Soon)'],
        },
        {
            label: 'Lists',
            subItems: ['List 1 (Coming Soon)', 'List 2 (Coming Soon)', 'List 3 (Coming Soon)'],
        },
        {
            label: 'Controls',
            subItems: ['Control 1 (Coming Soon)', 'Control 2 (Coming Soon)', 'Control 3 (Coming Soon)'],
        },
        {
            label: 'Inventory',
            subItems: ['Stock Items (Coming Soon)', 'Reorder (Coming Soon)', 'Vendors (Coming Soon)'],
        },
        {
            label: 'Tools',
            subItems: ['Tool A (Coming Soon)', 'Tool B (Coming Soon)', 'Tool C (Coming Soon)'],
        },
        {
            label: 'Reports',
            subItems: ['Daily Report (Coming Soon)', 'Monthly Report (Coming Soon)', 'Yearly Report (Coming Soon)'],
        },
        {
            label: 'Web Links',
            subItems: ['Link A (Coming Soon)', 'Link B (Coming Soon)', 'Link C (Coming Soon)'],
        },
        {
            label: 'Window',
            subItems: ['Cascade (Coming Soon)', 'Tile (Coming Soon)', 'Close All (Coming Soon)'],
        },
        {
            label: 'Help',
            subItems: ['Help Contents (Coming Soon)', 'About (Coming Soon)', 'Check for Updates (Coming Soon)'],
        },
    ];

    const iconData = [
        {
            label: config.screenLabels.checkin,
            icon: MdPersonOutline,
            hoverText: "Patient Check-In/Out",
            path: "/",
        },
        {
            label: config.screenLabels.scheduler,
            icon: MdCalendarToday,
            hoverText: "Appointment Scheduler",
            path: "/scheduler",
        },
        {
            label: config.screenLabels.notes,
            icon: MdNoteAlt,
            hoverText: "Patient Notes",
            path: "/notes",
        },
        {
            label: config.screenLabels.services,
            icon: MdMedicalServices,
            hoverText: "Patient Services",
            path: "/services",
        },
        {
            label: config.screenLabels.invoices,
            icon: MdReceiptLong,
            hoverText: "Patient Invoices",
            path: "/invoices",
        },
        {
            label: config.screenLabels.records,
            icon: MdFolderOpen,
            hoverText: "Patient Medical Records",
            path: "/records",
        },
        {
            label: config.screenLabels.inventory,
            icon: MdInventory2,
            hoverText: "Inventory Management",
            path: "/inventory",
        },
        {
            label: config.screenLabels.communications,
            icon: MdMessage,
            hoverText: "Client Communications",
            path: "/communications",
        },
        {
            label: config.screenLabels.pharmacy,
            icon: MdMedication,
            hoverText: "Pharmacy & Prescriptions",
            path: "/pharmacy",
        },
        {
            label: config.screenLabels.reports,
            icon: MdInsights,
            hoverText: "Reports & Analytics",
            path: "/reports",
        },
    ];

    const handleNavigate = (path) => {
        if (path === null || path === undefined) {
            return;
        }
        navigate(createPIMSUrl('cornerstone', path));
    };

    // Helper function to check if a path is currently active
    const isActive = (path) => {
        if (path === null || path === undefined) {
            return false;
        }
        return location.pathname === createPIMSUrl('cornerstone', path);
    };

    // Get the current screen title based on the active path
    const getCurrentScreenTitle = () => {
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
        return 'Cornerstone';
    };

    return (
        <div className="layout-windows-classic pims-cornerstone">
            <div
                className="window"
                style={{
                    margin: '0',
                    padding: '0',
                    width: '100%',
                    maxWidth: 'none',
                    height: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
            >
                <div className="title-bar">
                    <div className="title-bar-text">Cornerstone</div>
                    <div className="title-bar-controls">
                        <button className="title-bar-button" aria-label="Minimize"></button>
                        <button className="title-bar-button" aria-label="Maximize"></button>
                        <button className="title-bar-button" aria-label="Close"></button>
                    </div>
                </div>

                <div
                    className="window-body"
                    style={{
                        padding: '0 16px 16px 16px',
                        height: 'calc(100vh - 30px)',
                        boxSizing: 'border-box',
                        overflow: 'auto',
                        backgroundColor: 'var(--background-color)'
                    }}
                >
                    {/* Main menu bar */}
                    <div
                        className="menu-bar"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
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
                                        color: 'var(--text-color)',
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
                                                backgroundColor: 'var(--background-color)',
                                                border: '2px solid var(--border-color)',
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
                                                        color: 'var(--text-color)',
                                                        cursor: 'pointer',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                    onMouseDown={(e) => {
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

                    {/* Page Title */}
                    <div
                        style={{
                            backgroundColor: '#000080',
                            color: 'white',
                            padding: '8px 12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}
                    >
                        {getCurrentScreenTitle()}
                    </div>

                    {/* Icon bar */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        {iconData.map((item, index) => (
                            <div
                                key={index}
                                className={`icon-container ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => handleNavigate(item.path)}
                                onMouseEnter={() => setHoveredIcon(index)}
                                onMouseLeave={() => setHoveredIcon(null)}
                            >
                                <item.icon className="icon" />
                                <span className="icon-label">{item.label}</span>
                                {hoveredIcon === index && (
                                    <div className="icon-tooltip">{item.hoverText}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Main content */}
                    <div className="cornerstone-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CornerstoneLayout; 