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
    const [hoveredIcon, setHoveredIcon] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: 'File', enabled: true },
        { label: 'Edit', enabled: true },
        { label: 'Activities', enabled: true },
        { label: 'Lists', enabled: true },
        { label: 'Controls', enabled: true },
        { label: 'Inventory', enabled: true },
        { label: 'Tools', enabled: true },
        { label: 'Reports', enabled: true },
        { label: 'Web Links', enabled: true },
        { label: 'Window', enabled: true },
        { label: 'Help', enabled: true }
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
                            backgroundColor: 'var(--menu-bg-color)',
                            borderBottom: '1px solid var(--border-color)'
                        }}
                    >
                        <ul
                            style={{
                                display: 'flex',
                                listStyle: 'none',
                                gap: '2px',
                                margin: 0,
                                padding: 0
                            }}
                        >
                            {menuItems.map((menu, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        padding: '2px 8px',
                                        cursor: menu.enabled ? 'pointer' : 'default',
                                        color: menu.enabled ? 'var(--text-color)' : 'var(--text-color-disabled)',
                                        backgroundColor: 'var(--button-bg)',
                                        border: '1px solid var(--border-color)',
                                        boxShadow: 'var(--button-shadow)',
                                        opacity: menu.enabled ? 1 : 0.6
                                    }}
                                >
                                    {menu.label}
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